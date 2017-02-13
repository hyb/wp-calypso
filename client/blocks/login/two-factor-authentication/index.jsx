/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import VerificationCodeInput from './verification-code-input';
import WaitingTwoFactorNotificationApproval from './waiting-notification-approval';
import { localize } from 'i18n-calypso';

class Login2FA extends Component {
	render() {
		const { waitingAppVerification } = this.props;
		return (
			<div className="login">
				{
					waitingAppVerification
					? ( <WaitingTwoFactorNotificationApproval /> )
					: ( <VerificationCodeInput /> )
				}
			</div>
		);
	}
}

export default connect( () => ( {
	waitingAppVerification: false
} ) )( localize( Login2FA ) );
