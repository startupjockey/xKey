// SAMPLE
this.manifest = {
    "name": "xKey",
    "icon": "icon.png",
    "settings": [
        {
            "tab": "General",
            "group": "Mode",
            "name": "mode",
            "type": "radioButtons",
            "label": "Please choose your default mode",
            "options": [
                {value: "vi", text: "GOD mode (vi)"},
                {value: "default", text: "Default browser access keys"}
            ],
            "default": "default" 
        },
        {
            "tab": "General",
            "group": "Custom",
            "name": "website1",
            "type": "text",
            "label": "Custom shortcut 1"
        },
        {
            "tab": "General",
            "group": "Custom",
            "name": "website2",
            "type": "text",
            "label": "Custom shortcut 2"
        },
        {
            "tab": "General",
            "group": "Custom",
            "name": "website3",
            "type": "text",
            "label": "Custom shortcut 3"
        }
    ]
};
