/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_SEND_BROWSER_INFO,
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

const sendBrowserInfo = ( connection, siteUrl ) => {
	const siteHelp = `Site I need help with: ${ siteUrl }\n`;
	const screenRes = ( typeof screen !== 'undefined' ) && `Screen Resolution: ${ screen.width }x${ screen.height }\n`;
	const browserSize = ( typeof window !== 'undefined' ) && `Browser Size: ${ window.innerWidth }x${ window.innerHeight }\n`;
	const userAgent = ( typeof navigator !== 'undefined' ) && `User Agent: ${ navigator.userAgent }`;
	const msg = {
		text: `Info\n ${ siteHelp } ${ screenRes } ${ browserSize } ${ userAgent }`,
	};

	debug( 'sending info message', msg );
	connection.info( msg );
};

export default function( connection = null ) {
	// Allow a connection object to be specified for
	// testing. If blank, use a real connection.
	if ( connection == null ) {
		connection = require( './common' ).connection;
	}

	return store => next => action => {
		switch ( action.type ) {
			case HAPPYCHAT_SEND_BROWSER_INFO:
				sendBrowserInfo( connection, action.siteUrl );
				break;

			case HAPPYCHAT_TRANSCRIPT_REQUEST:
				requestTranscript( connection, store );
				break;
		}
		return next( action );
	};
}
