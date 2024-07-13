# Bucket Browser

A desktop app to browse S3 buckets

> [!NOTE]
> This is still under active development. Check back soon for a v1 release!

## Todo

- [ ] Finish `README`
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
  - [ ] Clean up UI
  - [ ] Error handling
- [ ] Transfers
  - [ ] Create transfer infrastructure
  - [ ] Create `TransferUpload`
  - [x] Create `TransferDownload`
  - [x] Figure out how to send status updates to the UI
  - [ ] Create UI for transfers
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
  - [ ] Figure out how to properly theme `PrimeVue`
  - [ ] Windows window controls
- [ ] CI/CD
  - [ ] Get type checking hooked up
  - [ ] Write some tests
  - [ ] Create GitHub CI action to check types and test on push
  - [ ] Create build script
  - [ ] Create S3 target to upload build artifacts to
  - [ ] Hook up auto-updater
