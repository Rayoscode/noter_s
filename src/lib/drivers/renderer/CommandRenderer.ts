import type { Command } from "../Entities/Command/Command";

const commandRenderer = ( command: Command | undefined ) => {
    switch ( command?.name ) {
        case 'Bold': return document.createElement( 'b' );
        default: return '';
    }
};

export { commandRenderer };