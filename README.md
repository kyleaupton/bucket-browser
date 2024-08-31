# Bucket Browser

A desktop app to browse, upload, and download objects on S3-compatible storage services.

> [!NOTE]
> This is still under active development. Check back soon for a v1 release!

<img src="https://raw.githubusercontent.com/kyleaupton/bucket-browser/main/docs/screenshot.png" />

## About

This Electron.js application provides a user-friendly interface to interact with the official AWS S3 SDK. It allows you to easily connect to your S3-compatible storage by specifying the endpoint, region, access key, and secret key. Once connected, you can browse through your buckets and objects, as well as ~~upload~~ (coming soon) and download files directly from the app. This tool is designed to simplify the management of your S3 storage, offering a better experience for handling your cloud data.

## Todo

- [x] Connection CRUD
  - [x] Add ability to create new connection
  - [x] Add ability to edit existing connection
  - [x] Store access secrets in key store (use `Keytar` package)
  - [x] Make access secret input a password input
- [ ] Connection browsing
  - [x] List buckets
  - [x] List objects
  - [x] Bucket/object traversal
  - [ ] OS native filesystem icons
    - [x] Spicific file icons
      - [x] Mac
      - [x] Windows
      - [x] Linux
    - [x] Folder icon
      - [x] Mac
      - [ ] Windows
      - [ ] Linux
    - [ ] Bucket Icon
      - [x] Mac
      - [ ] Windows
      - [ ] Linux
  - [x] Browser navigation controls
  - [x] Support pagination
  - [x] Clean up UI
  - [x] Error handling
- [ ] Transfers
  - [ ] Create transfer infrastructure
  - [ ] Create `TransferUpload`
  - [x] Create `TransferDownload`
  - [x] Figure out how to send status updates to the UI
  - [x] Create UI for transfers
  - [ ] Impliment pause, resume, cancel
    - [ ] Upload
    - [x] Download
  - [ ] Add logic for read/write vs. just read
  - [ ] Support folder downloads
  - [ ] Support folder uploads
  - [ ] Add conformation before transfers for budgetary reasons
- [ ] UI
  - [ ] Finish light mode colors
  - [ ] Create surface css vars for consistant background colors
  - [x] ~~Figure out how to properly theme `PrimeVue`~~ (Removed PrimeVue in favor of Shadcn)
  - [x] Windows window controls
- [ ] CI/CD
  - [ ] Type check on CI
  - [ ] ESLint check on CI
  - [ ] Write some tests
  - [ ] Create build script
  - [ ] Create S3 target to upload build artifacts to
  - [ ] Hook up auto-updater
