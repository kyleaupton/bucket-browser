# Bucket Browser

A desktop app to browse S3 buckets

> [!NOTE]
> This is still under active development. Check back soon for a v1 release!

## Todo

- [ ] Finish `README`
- [ ] Connection CRUD
  - [x] Add ability to create new connection
  - [x] Add ability to edit existing connection
  - [ ] Store access secrets in key store (use `Keytar` package)
  - [ ] Make access secret input a password input
- [ ] Connection browsing
  - [x] List buckets
  - [x] List objects
  - [x] Bucket/object traversal
  - [ ] OS native filesystem icons
    - [x] Spicific file icons
    - [x] Folder icon
    - [ ] Bucket Icon
      - [x] Mac
      - [ ] Windows
      - [ ] Linux...? (Maybe no linux build for v1)
  - [x] Browder navigation controls
  - [ ] Support pagination
  - [ ] Clean up UI
- [ ] Transfers
  - [ ] Create transfer infrastructure
  - [ ] Create `TransferUpload`
  - [ ] Create `TransferDownload`
  - [ ] Figure out how to send status updates to the UI
  - [ ] Create UI for transfers
  - [ ] Impliment pause, resume, cancel
  - [ ] Add logic for read/write vs. just read
- [ ] UI
  - [ ] Finish light mode colors
  - [ ] Create surface css vars for consistant background colors
  - [ ] Figure out how to properly theme `PrimeVue`
- [ ] CI/CD
  - [ ] Get type checking hooked up
  - [ ] Write some tests
  - [ ] Create GitHub CI action to check types and test on push
  - [ ] Create build script
  - [ ] Create S3 target to upload build artifacts to
  - [ ] Hook up auto-updater
