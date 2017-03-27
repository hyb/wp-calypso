/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_SEND_MESSAGE,
	HAPPYCHAT_TRANSCRIPT_REQUEST,
} from 'state/action-types';
import { receiveChatTranscript } from './actions';
import { getHappychatTranscriptTimestamp } from './selectors';

const debug = require( 'debug' )( 'calypso:happychat:actions' );

export const requestTranscript = ( connection, { getState, dispatch } ) => {
	const timestamp = getHappychatTranscriptTimestamp( getState() );
	debug( 'requesting transcript', timestamp );
	return connection.transcript( timestamp ).then(
		result => dispatch( receiveChatTranscript( result.messages, result.timestamp ) ),
		e => debug( 'failed to get transcript', e )
	);
};

const sendMessage = ( connection, message ) => {
	debug( 'sending message', message );
	connection.send( message );
	connection.notTyping();
};

export default function( connection = null ) {
	// Allow a connection object to be specified for
	// testing. If blank, use a real connection.
	if ( connection == null ) {
		connection = require( './common' ).connection;
	}

	return store => next => action => {
		switch ( action.type ) {
			case HAPPYCHAT_SEND_MESSAGE:
				sendMessage( connection, action.message );
				break;

			case HAPPYCHAT_TRANSCRIPT_REQUEST:
				requestTranscript( connection, store );
				break;
		}
		return next( action );
	};
}
