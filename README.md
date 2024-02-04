
# IYKYK Lexer and Parser

A real-time collaborative lexical and syntax analyzer of a GenZ-styled IYKYK programming language.

This programming language facilitates real-time collaborative editing of source code, allowing multiple developers to edit code within a live session. The language's portal is powered by Socket.IO, which manages real-time changes between sessions.

## App Walkthrough

**Landing Screen**

The landing screen allows users or developers to join or create a room for a coding session.

![Landing Screen](https://raw.githubusercontent.com/markcalendario/IYKYK-programming-language/main/docs/snapshots/welcome-screen.jpg)

**Room View**

The room view consists of blocks of components such as toolbar, code editor, and side popups. The toolbar includes buttons for parser, lexer, copy session link, upload file, and download file respectively. The code editor updates in real-time as clients commit code changes. The popups will show when someone joins or gets disconnected.

![Room View](https://raw.githubusercontent.com/markcalendario/IYKYK-programming-language/main/docs/snapshots/room-view.jpg)

*Room View with Lexer Result*

The result of lexical analysis will display a table that shows a line, lexeme, and token category of each symbols.

![Room View - Lexer](https://raw.githubusercontent.com/markcalendario/IYKYK-programming-language/main/docs/snapshots/lexer-result.jpg)

*Room View with Parser Result*

The result of syntax analyzer will show the parse tree if the code structure is correct. Otherwise, it will display an error message including line of the error and expectations.

![Room View - Parser](https://raw.githubusercontent.com/markcalendario/IYKYK-programming-language/main/docs/snapshots/parser-result.jpg)

*Sample Parser Error* 

![Sample Parser Error](https://raw.githubusercontent.com/markcalendario/IYKYK-programming-language/main/docs/snapshots/sample-parser-error.jpg)
## Tech Stack

**Client:** Next, SASS

**Server:** Node, Express, Socket.IO


## Documentation

[Lexer Documentation](https://github.com/markcalendario/IYKYK-programming-language/blob/main/docs/documents/IYKYK%20Programming%20Language%20Documentation%20-%20GROUP%202.pdf)

[Parser Documentation](https://github.com/markcalendario/IYKYK-programming-language/blob/main/docs/documents/IYKYK%20Programming%20Language%20Documentation%20-%20GROUP%202.pdf)


## License

Copyright © 2024 Mark Kenneth S. Calendario. All rights reserved.

This code is protected by the copyright law. No part of this system may be reproduced, distributed, or transmitted in any form or by any means, without the prior written permission of the copyright holder.

For permission requests, please contact: markcalendario@gmail.com

