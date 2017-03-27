/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { trim, debounce, sampleSize } from 'lodash';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import CompactCard from 'components/card/compact';
import DocumentHead from 'components/data/document-head';
import RecommendedPosts from 'reader/stream/recommended-posts';
import HeaderBack from 'reader/header-back';
import SearchInput from 'components/search';
import ReaderMain from 'components/reader-main';
// import SubscriptionListItem from 'blocks/reader-subscription-list-item/';
// import { recordTrackForPost, recordAction, recordTrack } from 'reader/stats';
// import { } from 'reader/follow-button/follow-sources';

class FollowingManage extends Component {

	static propTypes = {
		query: React.PropTypes.string,
	};

	updateQuery = ( newValue ) => {
		this.scrollToTop();
		const trimmedValue = trim( newValue ).substring( 0, 1024 );
		if ( ( trimmedValue !== '' &&
				trimmedValue.length > 1 &&
				trimmedValue !== this.props.query
			) ||
			newValue === ''
		) {
			this.props.onQueryChange( newValue );
		}
	}

	scrollToTop = () => {
		window.scrollTo( 0, 0 );
	}

	handleStreamMounted = ( ref ) => {
		this.streamRef = ref;
	}

	handleSearchBoxMounted = ( ref ) => {
		this.searchBoxRef = ref;
	}

	resizeSearchBox = () => {
		if ( this.searchBoxRef && this.streamRef ) {
			const width = this.streamRef.getClientRects()[ 0 ].width;
			if ( width > 0 ) {
				this.searchBoxRef.style.width = `${ width }px`;
			}
		}
	}

	componentDidMount() {
		this.resizeListener = window.addEventListener(
			'resize',
			debounce( this.resizeSearchBox, 50 )
		);
		this.resizeSearchBox();

		this.props.recommendationsStore.on( 'change', this.updateState );
		this.props.requestFollows();
	}

	componentWillUnmount() {
		window.removeEventListener( 'resize', this.resizeListener );
		this.props.recommendationsStore.off( 'change', this.updateState );
	}

	state = this.getStateFromStores();

	updateState = ( store ) => {
		this.setState( this.getStateFromStores( store ) );
	}

	getStateFromStores() {
		const { recommendationsStore } = this.props;
		return {
			recommendations: recommendationsStore.get()
		};
	}

	render() {
		const { query, translate } = this.props;
		const searchPlaceholderText = translate( 'Search millions of sites' );
		const recommendations = sampleSize( this.state.recommendations, 2 );

		return (
			<ReaderMain className="following-manage">
				{ this.props.showBack && <HeaderBack /> }
				<h1> Follow Something New </h1>
				<DocumentHead title={ 'Manage Following' } />
				<div ref={ this.handleStreamMounted } />
				<div className="following-manage__fixed-area" ref={ this.handleSearchBoxMounted }>
					<CompactCard className="following-manage__input-card">
						<SearchInput
							onSearch={ this.updateQuery }
							onSearchClose={ this.scrollToTop }
							autoFocus={ this.props.autoFocusInput }
							delaySearch={ true }
							delayTimeout={ 500 }
							placeholder={ searchPlaceholderText }
							initialValue={ query }
							value={ query }>
						</SearchInput>
					</CompactCard>
				</div>
				<RecommendedPosts recommendations={ recommendations } />
			</ReaderMain>
		);
	}
}

export default connect(
	null,
	dispatch => ( {
		requestFollows: () => dispatch( { type: 'READER_FOLLOWS_SYNC_START' } ),
	} ),
)(	localize( FollowingManage ) );
