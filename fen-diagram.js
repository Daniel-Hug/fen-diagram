
function Board() {
    "use strict";
    var i;

    this.positions = new Array(64);

    for (i = 0; i < 64; ++i) {
        this.positions[i] = 0;
    }

    this.whiteKingside = false;
    this.whiteQueenside = false;
    this.blackKingside = false;
    this.blackQueenside = false;
    this.enPassantTargetSquare = -1;
    this.activeColour = 0;
    this.halfmoveClock = 0;
    this.fullmoveNumber = 0;

}

var FenTools = (function () {
    "use strict";
    var EMPTY = 0,
        WHITE_PAWN = 1,
        WHITE_ROOK = 2,
        WHITE_QUEEN = 5,
        WHITE_KING = 6,
        BLACK_PAWN = 7,
        BLACK_ROOK = 8,
        BLACK_QUEEN = 11,
        BLACK_KING = 12,
        WHITE = 0,
        BLACK = 1;

    return {

        "importFEN": function (board, text, i) {
            var parsedStrings, warnings;

            function parseFields(text, i) {
                i = i || 0;

                function readWhitespace() {
                    var c;
                    while (i < text.length) {
                        c = text.charAt(i);
                        if (c !== " " && c !== "\t") {
                            break;
                        }
                        ++i;
                    }
                }

                function read(legal, ignoreWhitespace) {
                    var parsed, c;
                    readWhitespace();
                    for (parsed = ""; i < text.length; ++i) {
                        c = text.charAt(i);
                        if (legal.indexOf(c) !== -1) {
                            parsed += c;
                        } else if (c === " " || c === "\t") {
                            if (!ignoreWhitespace) {
                                break;
                            }
                        } else {
                            break;
                        }
                    }
                    return parsed;
                }

                function hasValue(legal, ignoreWhitespace) {
                    var c;
                    c = text.charAt(i);
                    if (c === "-") {
                        ++i;
                        readWhitespace();
                        return c;
                    }
                    return read(legal, ignoreWhitespace);
                }

                function readNumber() {
                    var c;
                    c = text.charAt(i);
                    if (c === "0") {
                        ++i;
                        readWhitespace();
                        return c;
                    }
                    return read(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], false);
                }

                i = 0;

                return {
                    "piecePlacement": read(["p", "r", "n", "b", "q", "k", "P", "R", "N", "B", "Q", "K", "1", "2", "3", "4", "5", "6", "7", "8", "/", "\\"], false).replace(/\\/g, "/"),
                    "activeColour": read(["w", "b", "W", "B"], true).replace("W", "w").replace("B", "b"),
                    "castlingAvailability": hasValue(["K", "Q", "k", "q"], true),
                    "enPassantTargetSquare": hasValue(["a", "b", "c", "d", "e", "f", "g", "h", "1", "2", "3", "4", "5", "6", "7", "8", "A", "B", "C", "D", "E", "F", "G", "H"]).toLowerCase(),
                    "numberParamOne": readNumber(),
                    "numberParamTwo": readNumber(),
                    "postMatch": text.substr(i, text.length - i)
                };

            }

            function processPlacements(text) {
                var i, j, x, y, c, NOTATION, pieceValue, numberOfEmptySquares;

                NOTATION = [ "P", "R", "N", "B", "Q", "K", "p", "r", "n", "b", "q", "k" ];

                for (i = j = y = x = 0; i < text.length; ++i) {
                    c = text.charAt(i);
                    pieceValue = NOTATION.indexOf(c);
                    if (++pieceValue) {
                        if (x > 7) {
                            warnings[warnings.length] = "Too many squares defined on rank " + (8 - y) + ". Ignoring everything after the last file.";
                            while (++i < text.length) {
                                c = text.charAt(i);
                                if (c === "/") {
                                    --i;
                                    break;
                                }
                            }
                        } else {
                            board.positions[j++] = pieceValue;
                            ++x;
                        }
                    } else if (c === "/") {
                        if (x !== 8) {
                            warnings[warnings.length] = "Not enough squares defined on rank " + (8 - y) + ". Empty spaces will be used for the remainder.";
                            while (x < 8) {
                                board.positions[j++] = EMPTY;
                                ++x;
                            }
                        }
                        if (y++ === 7) {
                            warnings[warnings.length] = "Too many ranks have been defined. Ignoring everything before rank 1.";
                            return;
                        }
                        x = 0;
                    } else {
                        for (numberOfEmptySquares = parseInt(c, 10); numberOfEmptySquares > 0; --numberOfEmptySquares) {
                            if (x > 7) {
                                warnings[warnings.length] = "Too many squares defined on rank " + (8 - y) + ". Ignoring everything after the last file.";
                                while (++i < text.length) {
                                    c = text.charAt(i);
                                    if (c === "/") {
                                        numberOfEmptySquares = 0;
                                        --i;
                                        break;
                                    }
                                }
                            } else {
                                board.positions[j++] = EMPTY;
                                ++x;
                            }
                        }
                    }
                }

                if (x !== 8 || y < 7) {
                    warnings[warnings.length] = "All 64 squares have not been defined.";
                    do {
                        board.positions[j++] = EMPTY;
                    } while (j < 64);
                }

            }

            function validatePlacements() {
                var x, y, i, pieceValue, whitePieceCount, blackPieceCount, whiteKing, blackKing;

                whiteKing = blackKing = false;
                whitePieceCount = blackPieceCount = 0;

                for (i = y = 0; y < 8; ++y) {
                    for (x = 0; x < 8; ++x) {
                        pieceValue = board.positions[i];
                        if (pieceValue >= WHITE_PAWN && pieceValue <= WHITE_QUEEN) {
                            ++whitePieceCount;
                            if (whitePieceCount > 15) {
                                warnings[warnings.length] = "Too many white pieces have been defined. Additional pieces have been ignored.";
                                board.positions[i] = EMPTY;
                            }
                        }
                        if (pieceValue >= BLACK_PAWN && pieceValue <= BLACK_QUEEN) {
                            ++blackPieceCount;
                            if (blackPieceCount > 15) {
                                warnings[warnings.length] = "Too many black pieces have been defined. Additional pieces have been ignored.";
                                board.positions[i] = EMPTY;
                            }
                        }
                        if ((pieceValue === WHITE_PAWN || pieceValue === BLACK_PAWN) && (y === 0 || y === 7)) {
                            warnings[warnings.length] = "Pawns cannot occupy the first and last ranks. These pieces have been ignored.";
                            board.positions[i] = EMPTY;
                        } else if (pieceValue === WHITE_KING) {
                            if (whiteKing) {
                                warnings[warnings.length] = "The white King has defined more than once on the board. Only one was used.";
                                board.positions[i] = EMPTY;
                            }
                            whiteKing = true;
                        } else if (pieceValue === BLACK_KING) {
                            if (blackKing) {
                                warnings[warnings.length] = "The black King has defined more than once on the board. Only one was used.";
                                board.positions[i] = EMPTY;
                            }
                            blackKing = true;
                        }
                        ++i;
                    }
                }

                if (!whiteKing) {
                    warnings[warnings.length] = "No white King was found in the definition.";
                }

                if (!blackKing) {
                    warnings[warnings.length] = "No black King was found in the definition.";
                }

            }


            function processActiveColour(text) {
                switch (text) {
                case "":
                    warnings[warnings.length] = "Active player has not been set. White has been used.";
                    board.activeColour = WHITE;
                    break;
                case "w":
                    board.activeColour = WHITE;
                    break;
                case "b":
                    board.activeColour = BLACK;
                    break;
                }
            }

            function processCastling(text) {
                var i, c;

                board.whiteKingside = board.whiteQueenside = board.blackKingside = board.blackQueenside = false;

                if (text === "") {
                    warnings[warnings.length] = "No castling definitions found. None have been set.";
                    return;
                }

                if (text === "-") {
                    return;
                }

                for (i = 0; i < text.length; ++i) {
                    c = text.charAt(i);
                    switch (c) {
                    case "K":
                        if (board.positions[60] !== WHITE_KING) {
                            warnings[warnings.length] = "The white King is not in a position to King-side castle. Definition ignored.";
                        } else if (board.positions[63] !== WHITE_ROOK) {
                            warnings[warnings.length] = "The white rook on the King's side is not in a position to castle. Definition ignored.";
                        } else {
                            if (board.whiteKingside) {
                                warnings[warnings.length] = "Kingside castling for white has already been defined.";
                            } else {
                                if (board.whiteQueenside || board.blackKingside || board.blackQueenside) {
                                    warnings[warnings.length] = "For castling definitions, K should precede Q, k, and q.";
                                }
                                board.whiteKingside = true;
                            }
                        }
                        break;
                    case "Q":
                        if (board.positions[60] !== WHITE_KING) {
                            warnings[warnings.length] = "The white King is not in a position to Queen-side castle. Definition ignored.";
                        } else if (board.positions[56] !== WHITE_ROOK) {
                            warnings[warnings.length] = "The white rook on the Queen's side is not in a position to castle. Definition ignored.";
                        } else {
                            if (board.whiteQueenside) {
                                warnings[warnings.length] = "Queenside castling for white has already been defined.";
                            } else {
                                if (board.blackKingside || board.blackQueenside) {
                                    warnings[warnings.length] = "For castling definitions, Q should precede k, and q.";
                                }
                                board.whiteQueenside = true;
                            }
                        }
                        break;
                    case "k":
                        if (board.positions[4] !== BLACK_KING) {
                            warnings[warnings.length] = "The black King is not in a position to King-side castle. Definition ignored.";
                        } else if (board.positions[7] !== BLACK_ROOK) {
                            warnings[warnings.length] = "The black rook on the Queen's side is not in a position to castle. Definition ignored.";
                        } else {
                            if (board.blackKingside) {
                                warnings[warnings.length] = "Kingside castling for black has already been defined.";
                            } else {
                                if (board.blackQueenside) {
                                    warnings[warnings.length] = "For castling definitions, k should precede q.";
                                }
                                board.blackKingside = true;
                            }
                        }
                        break;
                    case "q":
                        if (board.positions[4] !== BLACK_KING) {
                            warnings[warnings.length] = "The black King is not in a position to Queen-side castle. Definition ignored.";
                        } else if (board.positions[0] !== BLACK_ROOK) {
                            warnings[warnings.length] = "The black rook on the Queen's side is not in a position to castle. Definition ignored.";
                        } else {
                            if (board.blackQueenside) {
                                warnings[warnings.length] = "Black Queenside castling has already been defined.";
                            } else {
                                board.blackQueenside = true;
                            }
                        }
                        break;
                    }
                }
            }

            function processEnPassantTargetSquare(text) {
                var rank, file;

                if (text === "") {
                    warnings[warnings.length] = "No en Passant definition found. None has been set.";
                    board.enPassantTargetSquare = -1;
                    return;
                }

                if (text === "-") {
                    board.enPassantTargetSquare = -1;
                    return;
                }

                if (text.length < 2) {
                    warnings[warnings.length] = "Illegal en Passant designation. None has been set.";
                    board.enPassantTargetSquare = -1;
                    return;
                }

                rank = [ "a", "b", "c", "d", "e", "f", "g", "h" ].indexOf(text.charAt(0));

                if (rank === -1) {
                    warnings[warnings.length] = "Illegal en Passant designation. None has been set.";
                    board.enPassantTargetSquare = -1;
                    return;
                }

                file = [ "1", "2", "3", "4", "5", "6", "7", "8" ].indexOf(text.charAt(1));

                if (file === -1) {
                    warnings[warnings.length] = "Illegal en Passant designation. None has been set.";
                    board.enPassantTargetSquare = -1;
                    return;
                }

                if (file !== 2 && file !== 5) {
                    warnings[warnings.length] = "Illegal en Passant designation. None has been set.";
                    board.enPassantTargetSquare = -1;
                    return;
                }

                if (file === 2) {
                    if (board.activeColour === WHITE) {
                        warnings[warnings.length] = "Illegal en Passant designation, as it is white's turn to move.";
                        board.enPassantTargetSquare = -1;
                        return;
                    }
                    if (board.positions[32 + rank] !== WHITE_PAWN || board.positions[40 + rank] || board.positions[48 + rank]) {
                        warnings[warnings.length] = "The squares surrounding the en Passant setting invalidates the definition.";
                        board.enPassantTargetSquare = -1;
                        return;
                    }
                }

                if (file === 5) {
                    if (board.activeColour === BLACK) {
                        warnings[warnings.length] = "Illegal en Passant designation, as it is black's turn to move.";
                        board.enPassantTargetSquare = -1;
                        return;
                    }
                    if (board.positions[24 + rank] !== BLACK_PAWN || board.positions[8 + rank] || board.positions[16 + rank]) {
                        warnings[warnings.length] = "The squares surrounding the en Passant setting invalidates the definition.";
                        board.enPassantTargetSquare = -1;
                        return;
                    }
                }

                board.enPassantTargetSquare = (7 - file) * 8 + rank;
            }

            function processHalfmoveClockAndFullMoveNumber(numberParamOne, numberParamTwo) {
                if (numberParamOne === "") {
                    warnings[warnings.length] = "No half-move count was found. The half move count has been set arbitrarily to zero.";
                    warnings[warnings.length] = "No full-move number was found. The half move count has been set arbitrarily to one.";
                    board.halfmoveClock = 0;
                    board.fullmoveNumber = 1;
                    return;
                }

                if (numberParamTwo === "") {
                    warnings[warnings.length] = "No half-move count was found. The half move count has been arbitrarily set to zero.";
                    board.halfmoveClock = 0;
                    board.fullmoveNumber = parseInt(numberParamOne, 10);
                    return;
                }

                board.halfmoveClock = parseInt(numberParamOne, 10);
                board.fullmoveNumber = parseInt(numberParamTwo, 10);
            }

            parsedStrings = parseFields(text, i);
            warnings = [];

            processPlacements(parsedStrings.piecePlacement);
            validatePlacements();
            processActiveColour(parsedStrings.activeColour);
            processCastling(parsedStrings.castlingAvailability);
            processEnPassantTargetSquare(parsedStrings.enPassantTargetSquare);
            processHalfmoveClockAndFullMoveNumber(parsedStrings.numberParamOne, parsedStrings.numberParamTwo);

            if (parsedStrings.postMatch !== "") {
                warnings[warnings.length] = "The following text was ignored in the FEN definition: " + parsedStrings.postMatch;
            }

            return warnings;
        },

        "exportFEN": function (board) {
            var fen, value, i, numberOfEmptySquares;

            fen = "";

            for (i = numberOfEmptySquares = 0; i < 64; ++i) {
                value = board.positions[i];
                if (value) {
                    if (numberOfEmptySquares) {
                        fen += numberOfEmptySquares;
                        numberOfEmptySquares = 0;
                    }
                    fen += [ undefined, "P", "R", "N", "B", "Q", "K", "p", "r", "n", "b", "q", "k" ][value];
                } else {
                    ++numberOfEmptySquares;
                }
                if ((i + 1) % 8 === 0) {
                    if (numberOfEmptySquares) {
                        fen += numberOfEmptySquares;
                        numberOfEmptySquares = 0;
                    }
                    if (i !== 63) {
                        fen += "/";
                    }
                }
            }

            fen += " ";

            switch (board.activeColour) {
            case WHITE:
                fen += "w";
                break;
            case BLACK:
                fen += "b";
                break;
            }

            fen += " ";

            if (board.whiteKingside) {
                fen += "K";
            }
            if (board.whiteQueenside) {
                fen += "Q";
            }
            if (board.blackKingside) {
                fen += "k";
            }
            if (board.blackQueenside) {
                fen += "q";
            }

            if (!board.whiteKingside && !board.whiteQueenside && !board.blackKingside && !board.blackQueenside) {
                fen += "-";
            }

            fen += " ";

            if (board.enPassantTargetSquare === -1) {
                fen += "-";
            } else {
                fen += [ "a", "b", "c", "d", "e", "f", "g", "h" ][board.enPassantTargetSquare % 8];
                fen += 8 - Math.floor(board.enPassantTargetSquare / 8);
            }

            fen += " ";

            fen += board.halfmoveClock;

            fen += " ";

            fen += board.fullmoveNumber;

            return fen;
        }

    };

}());

function boardGfx(themeUrl, succ) {
    "use strict";
    var theme, images, IMAGE_BACKGROUND, IMAGE_BOARD, DEFAULT_THEME;
    images = [];
    IMAGE_BACKGROUND = 0;
    IMAGE_BOARD = 13;
    DEFAULT_THEME = {
        "caption": {
            "align": "center",
            "font": "13px \"Helvetica Neue\", \"Helvetica\", \"Arial\", sans-serif",
            "style": "black",
            "x": 256,
            "y": 510
        },
        "height": 520,
        "images": [
            "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"
        ],
        "squares": {
            "height": 55,
            "width": 55,
            "x": 48,
            "y": 13
        },
        "turn": {
            "x": 14,
            "y": 465
        },
        "width": 500
    };

    function getJSON(url, succ, fail) {
        var http;
        http = new XMLHttpRequest();
        http.open("GET", url, true);
        http.onreadystatechange = function () {
            if (http.readyState === 4) {
                if (http.status === 200) {
                    succ(JSON.parse(http.responseText));
                } else {
                    fail(http);
                }
            }
        };
        http.send();
    }

    function loadImages(rawJsonArray, callback, i) {
        i = i || 0;
        if (images.length === rawJsonArray.length) {
            callback(images);
        } else {
            images[i] = document.createElement("img");
            images[i].addEventListener("load", function () {
                loadImages(rawJsonArray, callback, i + 1, images);
            }, false);
            images[i].setAttribute("src", "data:image/png;base64," + rawJsonArray[i]);
        }
    }

    if (themeUrl !== undefined) {
        getJSON(themeUrl, function (jsonResponse) {
            theme = jsonResponse;
            loadImages(theme.images, function (convertedImages) {
                images = convertedImages;
                succ();
            });
        }, function () {
            throw ("Unable to fetch " + themeUrl);
        });
    } else {
        theme = DEFAULT_THEME;
        loadImages(theme.images, function (convertedImages) {
            images = convertedImages;
            succ();
        });
    }

    function drawBoard(ctx) {
        ctx.drawImage(images[IMAGE_BACKGROUND], 0, 0);
        ctx.drawImage(images[IMAGE_BOARD], theme.squares.x, theme.squares.y);
    }

    function drawTransparentSquare(ctx, r, g, b, x, y) {
        ctx.fillStyle = "rgb(" + r + ", " + g + ", " + b + ")";
        ctx.fillRect(theme.squares.x + theme.squares.width * x, theme.squares.y + theme.squares.height * y, theme.squares.width, theme.squares.height);
    }

    function update(ctx, board) {
        var x, y, i, value;
        drawBoard(ctx);
        if (board.whiteKingside) {
            drawTransparentSquare(ctx, 147, 174, 50, 7, 7);
        }
        if (board.whiteQueenside) {
            drawTransparentSquare(ctx, 147, 174, 50, 0, 7);
        }
        if (board.whiteKingside || board.whiteQueenside) {
            drawTransparentSquare(ctx, 147, 174, 50, 4, 7);
        }
        if (board.blackKingside) {
            drawTransparentSquare(ctx, 147, 174, 50, 7, 0);
        }
        if (board.blackQueenside) {
            drawTransparentSquare(ctx, 147, 174, 50, 0, 0);
        }
        if (board.blackKingside || board.blackQueenside) {
            drawTransparentSquare(ctx, 147, 174, 50, 4, 0);
        }
        if (board.enPassantTargetSquare !== -1) {
            ctx.save();
            ctx.globalAlpha = 0.2;
            ctx.drawImage(images[(board.enPassantTargetSquare <= 23) ? 7 : 1], theme.squares.x + theme.squares.width * (board.enPassantTargetSquare % 8), theme.squares.y + theme.squares.height * Math.floor(board.enPassantTargetSquare / 8));
            ctx.restore();
        }
        for (y = i = 0; y < 8; ++y) {
            for (x = 0; x < 8; ++x) {
                value = board.positions[i++];
                if (value) {
                    ctx.drawImage(images[value], theme.squares.x + theme.squares.width * x, theme.squares.y + theme.squares.height * y);
                }
            }
        }
        ctx.drawImage(images[board.activeColour + 14], theme.turn.x, theme.turn.y);

        ctx.fillStyle = theme.caption.style;
        ctx.font = theme.caption.font;
        ctx.textAlign = theme.caption.align;
        ctx.fillText(FenTools.exportFEN(board), theme.caption.x, theme.caption.y);
    }

    return {

        "getWidth": function () {
            return theme.width;
        },

        "getHeight": function () {
            return theme.height;
        },

        "drawBoard": drawBoard,

        "update": update

    };
}

window.addEventListener("load", function () {
    "use strict";
    var i, imgs;

    function createBoard(fen, theme, img) {
        var gfx;

        gfx = boardGfx((theme === null) ? undefined : theme, function () {
            var canvas, ctx, board;

            board = new Board();

            canvas = document.createElement("canvas");
            ctx = canvas.getContext("2d");
            canvas.setAttribute("width", gfx.getWidth());
            canvas.setAttribute("height", gfx.getHeight());

            if (fen !== null) {
                FenTools.importFEN(board, fen);

                gfx.update(ctx, board);

                img.setAttribute("src", canvas.toDataURL());
                img.setAttribute("title", FenTools.exportFEN(board));
            }

        });
    }

    imgs = document.getElementsByClassName("fen-diagram");
    for (i = 0; i < imgs.length; ++i) {
        createBoard(imgs[i].getAttribute("alt"), imgs[i].getAttribute("theme"), imgs[i]);
    }
}, false);