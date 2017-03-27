/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';
import { spy, stub } from 'sinon';

/**
 * Internal dependencies
 */
import {
	HAPPYCHAT_SEND_BROWSER_INFO,
	HAPPYCHAT_TRANSCRIPT_RECEIVE,
} from 'state/action-types';
import middleware, { requestTranscript } from '../middleware';
import useFakeDom from 'test/helpers/use-fake-dom';

describe( 'middleware', () => {
	useFakeDom();
	describe( 'HAPPYCHAT_SET_MESSAGE action', () => {
		it( 'should send relevant browser information to the connection', () => {
			const action = { type: HAPPYCHAT_SEND_BROWSER_INFO, siteUrl: 'http://butt.holdings/' };
			const connection = { info: spy() };
			middleware( connection )()( spy() )( action );

			expect( connection.info ).to.have.been.calledOnce;
			expect( connection.info.firstCall.args[ 0 ].text ).to.include( action.siteUrl );
		} );
	} );

	describe( 'HAPPYCHAT_TRANSCRIPT_REQUEST action', () => {
		it( 'should fetch transcript from connection and dispatch receive action', () => {
			const state = deepFreeze( {
				happychat: {
					timeline: []
				}
			} );
			const response = {
				messages: [
					{ text: 'hello' }
				],
				timestamp: 100000,
			};

			const connection = { transcript: stub().returns( Promise.resolve( response ) ) };
			const dispatch = stub();
			const getState = stub().returns( state );

			return requestTranscript( connection, { getState, dispatch } )
				.then( () => {
					expect( connection.transcript ).to.have.been.called;

					expect( dispatch ).to.have.been.calledWith( {
						type: HAPPYCHAT_TRANSCRIPT_RECEIVE,
						...response,
					} );
				} );
		} );
	} );
} );
