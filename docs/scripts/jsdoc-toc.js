(function($) {
    // TODO: make the node ID configurable
    var treeNode = $('#jsdoc-toc-nav');

    // initialize the tree
    treeNode.tree({
        autoEscape: false,
        closedIcon: '&#x21e2;',
        data: [{"label":"<a href=\"global.html\">Globals</a>","id":"global","children":[]},{"label":"<a href=\"global.html#app\">app</a>","id":"app","children":[{"label":"<a href=\"app.commands.html\">commands</a>","id":"app.commands","children":[{"label":"<a href=\"app.commands.api.html\">api</a>","id":"app.commands.api","children":[{"label":"<a href=\"app.commands.api.delete_api.html\">delete_api</a>","id":"app.commands.api.delete_api","children":[]},{"label":"<a href=\"app.commands.api.read_api.html\">read_api</a>","id":"app.commands.api.read_api","children":[]}]},{"label":"<a href=\"app.commands.help.html\">help</a>","id":"app.commands.help","children":[]},{"label":"<a href=\"app.commands.report.html\">report</a>","id":"app.commands.report","children":[]}]},{"label":"<a href=\"app.data.html\">data</a>","id":"app.data","children":[{"label":"<a href=\"app.data.reviews.html\">reviews</a>","id":"app.data.reviews","children":[]}]},{"label":"<a href=\"app.indexedStore.html\">indexedStore</a>","id":"app.indexedStore","children":[]},{"label":"<a href=\"app.report.html\">report</a>","id":"app.report","children":[]},{"label":"<a href=\"app.timeViz.html\">timeViz</a>","id":"app.timeViz","children":[]},{"label":"<a href=\"app.viewModel.html\">viewModel</a>","id":"app.viewModel","children":[]}]},{"label":"<a href=\"helpers.html\">helpers</a>","id":"helpers","children":[]}],
        openedIcon: ' &#x21e3;',
        saveState: true,
        useContextMenu: false
    });

    // add event handlers
    // TODO
})(jQuery);
