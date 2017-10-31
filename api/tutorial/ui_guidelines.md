# UI guidelines

**Index**

* [UI design](#ui-design)
  * [Left menu](#left-menu)
  * [Applications](#applications)
  * [Forms](#forms)
  * [Notifications](#notifications)
* [Accessibility](#accessibility)

## UI design

The whole web UI is designed following [PatternFly](http://www.patternfly.org/) patterns.
Please, read carefully PatternFly documentation before starting the design of a new web page.

The main goal is to have a consistent design and behavior across all modules.

All web page should guide the user to well-defined and specific task like:

- bad task example: "The user must choose the correct account provider"
- good task example: "The user must choose Active Directory provider if ACLs on shared folders are a functional requirements"

### Left menu

The left menu should be considered fixed: modules shouldn't add items inside the left menu.
When a module needs to add a new feature, the web page should be added inside exiting sections like "System".

### Applications

The Applications page is a container of each new module which implements new features, like mail server, nextcloud, etc.
Each new application web page should display:

- the status of the application status on the top
- a list of common actions just below the status
- all configuration parameters (forms, table, etc.) in the center

On first run, the application **must** display a modal wizard if the module can't be configured with a reasonable defaults.

Also the web page should display suggestions to help the user to follow best practices.
For example, inside the "Certificate page", the interface should display a suggestion to enable Let's Encrypt if 
a self-signed certificate is used as default.

Each application must be described by a [JSON manifest](./application_manifest) inspired to AppData freedesktop.org format.

### Forms

A configuration form should always display the minimum number of fields needed to configure the feature.
Extra parameters should be hidden inside an [Advanced](http://www.patternfly.org/pattern-library/forms-and-controls/expand-collapse-section/)
panel with reasonable defaults.

For example, when creating a user you need at least the user name, the full name and the password;
but you could hide extra details like street address or phone number.

Also it is a good practice to add a "Description" when creating records inside tables.

### Notifications

NethServer Cockpit provides multiple [toast notification](http://www.patternfly.org/pattern-library/communication/toast-notifications/).
Each notification can have one of these states:

- **success**: everything is ok. Transient: it stays on the screen for 8 seconds.
- **danger**: something went wrong. Not transient: it stays on the screen until the user explicitly close it.
  May require an action link.
- **warning**: something needs attention. Not transient: it stays on the screen until the user explicitly close it.

The notification can also have a type:

- **info**: display only a message
- **action**: display a message and an action link


Finally there also is a **task** notification, it stays on the screen until the task 
has been completed. This kind of notification can be created only by `signal-event`.


#### Example

Raise a notification after 5 seconds; add this code to `app.js`:
```
setTimeout(function() {
    nethserver.notificationMonitor.dispatchEvent('nsnotification', {
        type: 'action',
        title: 'Failed',
        message: 'Test failing notification',
        status: 'danger',
        action: 'Retry',
        method: function() {
            console.log("this method is called when the link is clicked!");
        }
    });
}, 5000);
```

### Modals

Modal overlay should be provided any time the user needs to enter data on a form and press "Save" button to change system configuration.

See also [Modal Overlay](http://www.patternfly.org/pattern-library/forms-and-controls/modal-overlay/) for extra use cases.

## Accessibility

We need to evaluate how PatternFly copes with people suffering of low vision, who need to access most features
using the keyboard shortcuts.

