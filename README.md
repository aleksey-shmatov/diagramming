### Preview

https://storage.googleapis.com/diagram-software/index.html

### Tools and frameworks

Typescript, ReactJS, CreateReactApp - core framework
mobx + mobx-state-tree - state management
roughjs - library to generate rough images

### SVG shape limitations

SVG shapes for which we want to apply roughness have to adhere certain criteria, otherwise results can be quite poor in terms of what you see and in terms of performance.
Here is list of requirements for optimal behaviour:

1. SVG's should not contain any CSS code(with exception of inline style attribute).
2. SVG's have to be as simple as possible. Ideally there should be no group elements at all and just few primitive svg elements placed at the top level.
3. Width and height attributes should be set for root svg object.
4. There should not be any scaling transformations within SVG.
