# How It Works

In basic terms, Parcel Prototyper takes a tree of assets and packages them into a tree of bundles by utilizing [Parcel Bundler](TODO: link) under the hood.

It extends Parcel Bundler by adding features commonly seen in static site generators, to allow you to create structured, <abbr title="Don't Repeat Yourself">DRY</abbr> prototypes without having to know more than HTML, CSS, and JavaScript.

It works in 5 steps:

1. A global data object is assembled from data files
2. An asset tree is constructed and assets are processed
3. A bundle tree is constructed and bundles are generated
4. Bundles are packaged and output
5. Static files are then copied over

For details on how steps 2, 3, and 4 work see the [Parcel documentation](TODO: link).


