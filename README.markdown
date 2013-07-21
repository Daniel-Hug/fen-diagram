[This article original appeared on andyh.org.](http://andyh.org/Chess-Diagrams.html)

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

&lt;Code removed&gt;

---

[This article original appeared on andyh.org.](http://andyh.org/Chess-Diagrams-Postscript.html)
 
In addition to my [previous article about generating chess diagrams](./Chess-Diagrams.html), I started thinking about how certain meta-data about the state of a chess game could be represented in an illustrated form. Details about the game which aren't immediately obvious and are not usually included on standard chess diagrams, such as whether either King would be able to castle, or whether a pawn had just made a two-square move and would therefore be prone to an 'en passant' move made by the opposing player.

I have made some adjustments to the code and the results can be seen in the following illustrations, as generated directly by the script on this page:

&lt;Illustration removed&gt;

&lt;Illustration removed&gt;

As you can see, the castling information for both players is represented by green squares occupied by the King and their respective Rooks, whereas when a pawn has made a two-square move, a faint image of the piece can be seen on the preceding square denoting that the opponent can take this piece by occupying the square on their immediate turn. In addition to this, a validated FEN-text representation of the board is also included on the diagram so that the half-move count and full-move number is made visible.

Finally, in order to generate custom illustrations, [I have also created FEN-edit, to see the diagram update dynamically as the notation is changed dynamically](./fen-diagram-2/fen-edit/). As well as generating an image which can be downloaded directly from the browser, the script also does some rudimentary validations, the results of which are visible on the right-hand side of the page. Although validating the legality of a board position in chess is practically limitless in scope for a given move number, some of the most obvious cases have been covered, such as a pawn cannot occupy for first or last ranks, checking on whether there is only one King per player, and whether the en passant square appears valid. [The source code is viewable at git-hub](https://github.com/andyherbert/fen-diagram).
