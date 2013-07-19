window.addEventListener("load", function () {
    "use strict";
    var gfx, input, canvas, ctx, warningsSpan, downloadImageLink;

    input = document.getElementById("fen-input");
    canvas = document.getElementById("board");
    ctx = canvas.getContext("2d");
    warningsSpan = document.getElementById("warnings");
    downloadImageLink = document.getElementById("download-image");

    function update() {
        var warnings, board;
        board = new Board();
        warnings = FenTools.importFEN(board, input.value);
        warningsSpan.textContent = warnings.join("\n");
        gfx.update(ctx, board);
        downloadImageLink.setAttribute("download", FenTools.exportFEN(board).replace(/\//g, "-").replace(/\s/g, "_"));
        downloadImageLink.setAttribute("href", canvas.toDataURL());
    }

    gfx = boardGfx(undefined, function () {
        input.addEventListener("input", update, false);
        update();
    });
}, false);