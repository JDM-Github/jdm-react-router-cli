# JDM CLI

### Generate Express routers, models, and middleware effortlessly.

## Installation

To install JDM CLI globally, run:
```sh
npm install -g jdm-cli
```

## Usage
After installation, you can use `jdm` from the terminal.

### **Create a New Component**
```sh
jdm create <type> <name>
```
- **type**: `router`, `model`, or `middleware`
- **name**: The name of the component

Example:
```sh
jdm create router user
```

### **Setup a New Project**
```sh
jdm setup [options]
```
Options:
- `--force`: Overwrite existing files
- `--clean`: Remove existing project files before setup

### **Clean a Project**
```sh
jdm clean
```
Removes unnecessary files and folders from your project.

### **View License**
```sh
jdm license
```
Displays the **MIT License** for JDM CLI.

## License
JDM CLI is licensed under the **MIT License**. Run `jdm license` to view it.


