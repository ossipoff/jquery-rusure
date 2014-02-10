# jquery-rusure

jQuery plugin for warning users about unsaved form changes, when navigating away from the page

### Usage

Initialize your jQuery set with the rusure method

```javascript
$('#formid').rusure({ message: 'An optional custom message to be displayed' });
```

Emulate navigation away from the page with the API method 'trigger'

```javascript
$('#formid').rusure('trigger', function() {
  console.log('Unload callback method called if user leaves page');
});
```
