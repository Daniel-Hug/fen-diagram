There are quite a few resources on the internet to generate chess diagrams, unfortunately it appears that most of them are now showing their age. After unsuccessfully searching for a suitable option, I decided on rendering my own. Ideally I wanted the diagrams to be crisp and clean, whilst maintaining a lean file-size. Eventually this led me to the idea of generating the illustration computationally, immediately after the page has loaded. This would be made possible by specifying the board state in notation form directly in the markup of the page, as well as leveraging the Javascript Canvas element.

Fortunately there is already a standard notation format for chess called Forsyth-Edwards Notation (FEN). It works quite simply by describing the position of every piece on the board, starting from the row occupied by the black pieces whist reading each row from left to right. Black pieces are donated in lowercase, whilst white are in uppercase.

Here we can see the initial position of the board described in FEN:

    rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1

The 'w' after the position of the pieces indicates that it is white's turn to move. For the purposes of this article we can ignore the remainder of the text, as it is not necessary for our purposes, however [a more detailed explanation is available on Wikipedia](http://en.wikipedia.org/wiki/Forsyth–Edwards_Notation).

The script used to generate the following illustration is quite simple: initially it generates the pieces used to represent the pieces, then it creates a 'canvas' element to draw the figures on. Immediately after this it will parse the notation used to describe the board, and lastly the 'src' attribute of the img element is altered to mimic the canvas.

&lt;Illustration removed&gt;

The method of inserting a diagram on to the page is also simple, a placeholder for the image is added by writing an 'img' tag. The notation is added to the 'alt' tag, and finally the class name is changed to 'fen-diagram' to tell the script that we want it to parse this img, and replace it with an illustration.

    <img class="fen-diagram" alt="5rk1/2p1bppp/Q7/1p2n3/5n2/2P2q2/PP1P1PbP/RNBBR1K1 w">

If the script is inserted at the head of the document and before the main body, then this replacement is immediate and automatic as the operation is registered and triggered on the page 'load' event. However, it is also possible to trigger the process manually, if necessary, by calling the 'convertImgsToFenDiagrams' function.

Optionally, it is also possible to change how the diagram appears on the page by supplying a url to an additional 'theme' attribute in the img tag. By using this method, it is possible to produce diagrams that appear slightly different to our stock illustration. For instance, the following diagram is a lot larger, at 1024 by 1024 pixels. Here it is shrunk by styling the img tag to a more manageable size in order to fit the page, but it is possible to view the whole diagram by dragging the image to the desktop, or alternatively, opening the image in a new page.

    <img class="fen-diagram" width="512" height="512" alt="r1k4r/p2nb1p1/2b4p/1p1n1p2/2PP4/3Q1NB1/1P3PPP/R5K1 w" theme="./resources/fen-diagram/staunton_1024.json">

&lt;Illustration removed&gt;

The theme file is written in JSON, and the description format used within it is quite simplistic, but functional. Hopefully by just looking at the source it will become obvious how it can be amended or replaced.

In the code that follows I have removed the portion that contains the embedded default theme, as it only adds length to this page, however [the full document fen-diagram.js is available for review](./scripts/fen-diagram.js). Unfortunately, omitting the 'src' attribute on an img tag is non-standard HTML. This issue can be avoided by referencing a placeholder image in the src attribute, which will get replaced once the script is called. If the diagram can't be generated then only notation will be shown, but is still functional yet less visual.

    function fenDiagram(fenNotation, theme, img) {
        "use strict";
        var gfx, TURN_NONE, TURN_WHITE, TURN_BLACK;
        TURN_NONE = 0;
        TURN_WHITE = 1;
        TURN_BLACK = 2;
        function boardGfx(themeUrl, succ) {
            var theme, images, IMAGE_BACKGROUND, IMAGE_BOARD, IMAGE_TURN_WHITE, IMAGE_TURN_BLACK, DEFAULT_THEME;
            images = [];
            IMAGE_BACKGROUND = 0;
            IMAGE_BOARD = 13;
            IMAGE_TURN_WHITE = 14;
            IMAGE_TURN_BLACK = 15;
            DEFAULT_THEME = {}; // Omitted for brevity.
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
            function drawPiece(ctx, value, squares, x, y) {
                ctx.drawImage(images[value], squares.x + squares.width * x, squares.y + squares.height * (7 - y));
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
            function update(canvas, board, turn) {
                var ctx, i;
                ctx = canvas.getContext("2d");
                ctx.drawImage(images[IMAGE_BACKGROUND], 0, 0);
                ctx.drawImage(images[IMAGE_BOARD], theme.squares.x, theme.squares.y);
                for (i = 0; i < 64; ++i) {
                    if (board.positions[i]) {
                        drawPiece(ctx, board.positions[i], theme.squares, i % 8, Math.floor(i / 8));
                    }
                }
                switch (turn) {
                case TURN_NONE:
                    break;
                case TURN_WHITE:
                    ctx.drawImage(images[IMAGE_TURN_WHITE], theme.turn.x, theme.turn.y);
                    break;
                case TURN_BLACK:
                    ctx.drawImage(images[IMAGE_TURN_BLACK], theme.turn.x, theme.turn.y);
                    break;
                }
            }
            return {
                "getWidth": function () {
                    return theme.width;
                },
                "getHeight": function () {
                    return theme.height;
                },
                "update": update
            };
        }
        function boardState() {
            var b, PIECE_VALUE;
            b = [];
            PIECE_VALUE = { "SPACE": 0, "PAWN_WHITE": 1, "ROOK_WHITE": 2, "KNIGHT_WHITE": 3, "BISHOP_WHITE": 4, "QUEEN_WHITE": 5, "KING_WHITE": 6, "PAWN_BLACK": 7, "ROOK_BLACK": 8, "KNIGHT_BLACK": 9, "BISHOP_BLACK": 10, "QUEEN_BLACK": 11, "KING_BLACK": 12 };
            function wipeBoard() {
                var i;
                for (i = 0; i < 64; ++i) {
                    b[i] = PIECE_VALUE.space;
                }
            }
            function place(value, x, y) {
                if (x > 7) {
                    throw ("A playing piece is placed past the end of a rank.");
                }
                if (y > 7) {
                    throw ("A playing piece is placed past the end of a file.");
                }
                b[y * 8 + x] = value;
            }
            wipeBoard();
            return {
                "remove": function (x, y) {
                    place(PIECE_VALUE.SPACE, x, y);
                },
                "whitePawn": function (x, y) {
                    place(PIECE_VALUE.PAWN_WHITE, x, y);
                },
                "whiteRook": function (x, y) {
                    place(PIECE_VALUE.ROOK_WHITE, x, y);
                },
                "whiteKnight": function (x, y) {
                    place(PIECE_VALUE.KNIGHT_WHITE, x, y);
                },
                "whiteBishop": function (x, y) {
                    place(PIECE_VALUE.BISHOP_WHITE, x, y);
                },
                "whiteQueen": function (x, y) {
                    place(PIECE_VALUE.QUEEN_WHITE, x, y);
                },
                "whiteKing": function (x, y) {
                    place(PIECE_VALUE.KING_WHITE, x, y);
                },
                "blackPawn": function (x, y) {
                    place(PIECE_VALUE.PAWN_BLACK, x, y);
                },
                "blackRook": function (x, y) {
                    place(PIECE_VALUE.ROOK_BLACK, x, y);
                },
                "blackKnight": function (x, y) {
                    place(PIECE_VALUE.KNIGHT_BLACK, x, y);
                },
                "blackBishop": function (x, y) {
                    place(PIECE_VALUE.BISHOP_BLACK, x, y);
                },
                "blackQueen": function (x, y) {
                    place(PIECE_VALUE.QUEEN_BLACK, x, y);
                },
                "blackKing": function (x, y) {
                    place(PIECE_VALUE.KING_BLACK, x, y);
                },
                "positions": b
            };
        }
        function fen(text) {
            var i, j, x, y, board, turn;
            x = 0;
            y = 7;
            board = boardState();
            try {
                for (i = 0; i < text.length; ++i) {
                    switch (text.charAt(i)) {
                    case "P":
                        board.whitePawn(x++, y);
                        break;
                    case "R":
                        board.whiteRook(x++, y);
                        break;
                    case "N":
                        board.whiteKnight(x++, y);
                        break;
                    case "B":
                        board.whiteBishop(x++, y);
                        break;
                    case "Q":
                        board.whiteQueen(x++, y);
                        break;
                    case "K":
                        board.whiteKing(x++, y);
                        break;
                    case "p":
                        board.blackPawn(x++, y);
                        break;
                    case "r":
                        board.blackRook(x++, y);
                        break;
                    case "n":
                        board.blackKnight(x++, y);
                        break;
                    case "b":
                        board.blackBishop(x++, y);
                        break;
                    case "q":
                        board.blackQueen(x++, y);
                        break;
                    case "k":
                        board.blackKing(x++, y);
                        break;
                    case "/":
                        if (x !== 8) {
                            throw ("Expected a piece designation.");
                        }
                        x = 0;
                        --y;
                        break;
                    case "1":
                    case "2":
                    case "3":
                    case "4":
                    case "5":
                    case "6":
                    case "7":
                    case "8":
                        for (j = parseInt(text.charAt(i), 10); j > 0; --j) {
                            board.remove(x++, y);
                        }
                        break;
                    default:
                        throw ("Illegal character.");
                    }
                    if (x === 8 && y === 0) {
                        break;
                    }
                }
                if (++i === text.length) {
                    turn = TURN_NONE;
                } else {
                    if (text.charAt(i) === " ") {
                        switch (text.charAt(++i)) {
                        case "w":
                        case "W":
                            turn = TURN_WHITE;
                            break;
                        case "b":
                        case "B":
                            turn = TURN_BLACK;
                            break;
                        default:
                            throw ("Expected either w, or b.");
                        }
                    } else {
                        throw ("Expected a single space or the end of the notation.");
                    }
                }
                return {
                    "board": board,
                    "turn": turn
                };
            } catch (err) {
                throw ("An error occured whilst attempting to parse " + fenNotation + " at column " + (i + 1) + " (" + fenNotation.charAt(i) + "): " + err);
            }
        }
        gfx = boardGfx(theme, function () {
            var canvas, state;
            canvas = document.createElement("canvas");
            canvas.setAttribute("width", gfx.getWidth());
            canvas.setAttribute("height", gfx.getHeight());
            state = fen(fenNotation);
            gfx.update(canvas, state.board, state.turn);
            img.setAttribute("src", canvas.toDataURL());
            if (img.getAttribute("title") === null) {
                img.setAttribute("title", fenNotation);
            }
        });
    }
    
    function convertImgsToFenDiagrams() {
        "use strict";
        var imgs, i, altAttribute, themeAttribute;
        imgs = document.getElementsByClassName("fen-diagram");
        for (i = 0; i < imgs.length; ++i) {
            altAttribute = imgs[i].getAttribute("alt");
            themeAttribute = imgs[i].getAttribute("theme");
            if (altAttribute !== null) {
                fenDiagram(altAttribute, (themeAttribute === null) ? undefined : themeAttribute, imgs[i]);
            }
        }
    }
    
    window.addEventListener("load", function () {
        "use strict";
        convertImgsToFenDiagrams();
    }, false);
