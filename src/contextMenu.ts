import { h, render } from 'vue';
import { createPopper, Placement, Instance } from '@popperjs/core';
import ContextMenu from '@/components/ContextMenu.vue';

export interface Option {
  render: () => ReturnType<typeof h>;
  command: () => void;
}

const WRAPPER_CLASS = 'context-menu-wrapper';

let popperInstance: Instance | null = null;
let onClose: (() => void) | null = null;

/**
 * Creates context menu and appends it to the body
 * @param e MouseEvent or PointerEvent
 * @param items Array of context menu items
 * @param options Options for positioning the context menu
 * @param optinos.anchor Position the context menu relative to the target element
 */
export const createContextMenu = (
  e: MouseEvent | PointerEvent,
  items: Option[],
  options?: {
    anchor?: Placement;
    target?: HTMLElement;
    onOpen?: () => void;
    onClose?: () => void;
  },
) => {
  // First thing we want to do is prevent the default context menu
  e.preventDefault();
  // Next remove any existing custom context menu
  removeContextMenu();
  // Call onOpen callback if provided
  options?.onOpen?.();
  // Assign onClose callback to module level variable
  onClose = options?.onClose || null;

  // Register event listeners
  // We do this in the next tick to avoid the click event that triggered the context menu
  setTimeout(() => {
    document.addEventListener('click', removeContextMenu);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('contextmenu', removeContextMenu);
  }, 1);

  // Create vnode
  const vnode = h(ContextMenu, { options: items });

  // Create vnode's container
  const container = document.createElement('div');
  container.className = WRAPPER_CLASS;
  container.style.position = 'absolute';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  // Render vnode inside container
  render(vnode, container);

  const _target = options?.target || e.target;

  if (options?.anchor && _target instanceof HTMLElement) {
    // If anchor is provided, use it to position the context menu
    // to the target element
    popperInstance = createPopper(_target, container, {
      placement: options.anchor,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 4],
          },
        },
      ],
    });
  } else {
    // If anchor is not provided, use the mouse position to position the context menu
    // Popper.js considers this a "virtual element"
    // https://popper.js.org/docs/v2/virtual-elements/
    popperInstance = createPopper(
      {
        getBoundingClientRect: generateGetBoundingClientRect(
          e.clientX,
          e.clientY,
        ),
        contextElement: document.body,
      },
      container,
      {
        placement: 'bottom-start',
      },
    );
  }
};

//
// Helpers
//
const generateGetBoundingClientRect = (x = 0, y = 0) => {
  return () => ({
    width: 0,
    height: 0,
    top: y,
    right: x,
    bottom: y,
    left: x,
    x: x,
    y: y,
    toJSON: () => {
      return {};
    },
  });
};

const handleKeyUp = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    removeContextMenu();
  }
};

const removeEvents = () => {
  document.removeEventListener('click', removeContextMenu);
  document.removeEventListener('keyup', handleKeyUp);
  document.removeEventListener('contextmenu', removeContextMenu);
};

const removeContextMenu = () => {
  if (popperInstance) {
    popperInstance.destroy();
    popperInstance = null;
  }

  const contextMenu = document.querySelector(`.${WRAPPER_CLASS}`);
  if (contextMenu) {
    contextMenu.remove();
    removeEvents();
  }

  // Call onClose callback if provided
  onClose?.();
  onClose = null;
};
