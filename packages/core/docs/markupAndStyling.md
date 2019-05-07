# Markup and styling
All Lion webcomponents have white label styling: this means theming is not applied,
but functional styling is.

## Functional styling
Functional styling can be divided into defaults for 'basic layout' and 'accessibility'.
Examples for both categories can be found below:

- Basic layout examples:
  - A dropdown menu has 'position: absolute'
  - A lion-button might behave as an 'display: inline-block' element
  - A suffix attached to an input is horizontally positioned (instead of vertically stacked)

- Accessibility examples:
  - content (for instance a caption in a table) can be 'visually hidden': it will be
readable by screen readers, but invisible for end users
  - when an html table is used, we allow [subclassers](./definitions.md) to override the display
property ('table-cell') to 'flex'. By putting the proper accessible roles ('role="cell"') in the
markup, we guaruantee our markup stays accessible

Although Lion components try to stay as unbiased as possible with regard to styling, defaults will
be needed. In these cases we try to follow the platform as much as possible. If the platform
doesn't provide defaults, the largest common denominator across exisiting UI frameworks is taken as
a lead.


## Style components
A style component consists of a set of css classes mapping to a certain html structure.
Read [more about style components](./styleComponents.md) here.
