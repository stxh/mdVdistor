// main
//
// import { marked } from '../../node_modules/marked';

const { Menu, MenuItem } = NeutralinoMenuBar;

const menu = [{
    label: "&File",
    submenu: [{
        label: "Open File",
        click: openFile
    }, {
        label: "Resent",
        submenu: [{
            label: "Option 1",
            click: () => {
                console.log("Option 1 clicked");
            }
        }, {
            label: "Option 2",
            click: () => {
                console.log("Option 2 clicked");
            }
        }],
        accelerator: "F2"
    }, {
        label: "Quit",
        click: () => { onWindowClose() }
    }]
}, {
    label: "&Option",
    submenu: [{
        label: "Mode",
        click: () => {  }
    }, {
        label: "Setting",
        click: () => {  }
    }, {
        label: "About",
        click: () => { Neutralino.os.showMessageBox("Version information",
            `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`)}
    }]
}];

var fileOpened; // current opened file

$(function() {

    const myMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(myMenu);

    // Neutralino.os.getEnvs().then((envs)=>{
    //     console.log(envs);
    // });

    // console.log("args->", NL_ARGS)
    if (NL_ARGS.length > 1) {
        fileOpened = NL_ARGS[1]
        setTitle(fileOpened)
        Neutralino.filesystem.readFile(fileOpened)
            .then((contain) => {
                $('#md').html(marked.parse(contain))
            })
            .catch((error) => {
                console.error("读取文件出错:", error)
            })
    }
    
    // alert("ok");
    // $('#md').html(marked.parse('# Marked in the browser\n\nRendered by **marked**.'));
});

// openFile open markdown file
function openFile() {
    Neutralino.os.showOpenDialog('Open Markdown file', {
        defaultPath: '',
        filters: [
          {name: 'markdown', extensions: ['md']},
          {name: 'txt', extensions: ['txt']}
        ]
      }) .then((filename) => {
        // console.log("open file:", filename)
        fileOpened = filename[0]
        setTitle(fileOpened)
        Neutralino.filesystem.readFile(fileOpened)
            .then((contain) => {
                $('#md').html(marked.parse(contain))
            })
            .catch((error) => {
                console.error("读取文件出错:", error)
            })
      })
      .catch((error) => {
        console.error("读取文件出错:", error); // 处理失败的情况
      });
}

function setTitle(fileOpened) {
    let title
    if (fileOpened) {
        title = "mdViewer - " + fileOpened
    } else {
        title = "mdViewer"
    }
    Neutralino.window.setTitle(title).then(()=>{})
}

function showInfo() {
    document.getElementById('info').innerHTML = `
        ${NL_APPID} is running on port ${NL_PORT} inside ${NL_OS}
        <br/><br/>
        <span>server: v${NL_VERSION} . client: v${NL_CVERSION}</span>
        `;
}

// let config = await Neutralino.app.getConfig();
// console.log('URL = ', config.url);

/*
    Function to set up a system tray menu with options specific to the window mode.
    This function checks if the application is running in window mode, and if so,
    it defines the tray menu items and sets up the tray accordingly.
*/
function setTray() {
    // Tray menu is only available in window mode
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }

    // Define tray menu items
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Get version"},
            {id: "OPEN", text: "Open File"},
            {id: "SEP", text: "-"},
            {id: "QUIT", text: "Quit"}
        ]
    };

    // Set the tray menu
    Neutralino.os.setTray(tray);
}

/*
    Function to handle click events on the tray menu items.
    This function performs different actions based on the clicked item's ID,
    such as displaying version information or exiting the application.
*/
function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            // Display version information
            Neutralino.os.showMessageBox("Version information",
                `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
        case "OPEN":
            openFile()
            break;
        case "QUIT":
            // Exit the application
            onWindowClose();
            break;
    }
}

/*
    Function to handle the window close event by gracefully exiting the Neutralino application.
*/
function onWindowClose() {
    Neutralino.app.exit();
}

// Conditional initialization: Set up system tray if not running on macOS
if(NL_OS != "Darwin") { // TODO: Fix https://github.com/neutralinojs/neutralinojs/issues/615
    setTray();
}

Neutralino.init()

// Register event listeners
Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

