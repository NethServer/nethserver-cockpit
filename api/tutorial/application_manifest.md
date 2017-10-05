# Application manifest

Applications are described by a JSON manifest inspired to [AppData](https://www.freedesktop.org/software/appstream/docs/chap-Quickstart.html)
metadata format.

Manifest must be placed under `/usr/share/cockpit/nethserver/applications` directory and named with the application id like `<id>.json`;

## Format

- **id**: this tag contains the unique identifier for this application (required)
- **name**: descriptive name of the application (required)
- **summary**: describe what is the purpose of the application in few words (required)
- **description**: include 2-3 paragraphs describing any important features. Supports markdown format. (recommended)
- **screenshots**: a list of screenshots; all screenshots should have a 16:9 aspect ratio, and should have a width that is no smaller than 620px (optional)
- **url**: link to local application installation. (required for web applications)
- **homepage**: this is a recommended tag for link project official site (optional)
- **release**: define the version and release date of this application (recommended)
- **provides**: list of provided RPM packages (optional)

### Example

File  `/usr/share/cockpit/nethserver/applications/nextcloud.json`
```
{
  "id": "netxtcloud",
  "name": "NextCloud"
  "summary": "Share your data",
  "description": { 
    ["Access, **share** and protect your files, calendars, contacts, communication & more at home and in your enterprise."],
    ["Nextcloud puts your data at your fingertips, under your control."]
  },
  "screenshots": { 
     ["caption" : "Login", "image" : "http://my.screenshot.org/login.png" ] 
     ["caption" : "Share data", "image" : "http://my.screenshot.org/data.png" ] 
  },
  "url": "/nextcloud",
  "homepage": "http://www.nextcloud.org"
  "provides": { ["nextcloud", "nethserver-nextcloud"] }
  "release": { "version": "12.0.2" }
}
```

