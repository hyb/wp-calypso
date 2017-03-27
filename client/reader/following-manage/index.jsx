/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { trim, debounce, sampleSize, map, take } from 'lodash';
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
import SubscriptionListItem from 'blocks/reader-subscription-list-item/';
import { getReaderFollows } from 'state/selectors';
import QueryReaderFollows from 'components/data/query-reader-follows';
import feedSiteFluxAdapter from 'lib/reader-site-feed-flux-adapter';
// import { recordTrackForPost, recordAction, recordTrack } from 'reader/stats';
// import { } from 'reader/follow-button/follow-sources';

/*
	isFollowing,
	siteUrl,
	siteTitle,
	siteAuthor,
	siteExcerpt,
	feedId,
	siteId,
	className = '',
	onSiteClick = () => {},
	followSource,
	lastUpdated,
	translate,
*/

const ConnectedFollowListItem = localize( feedSiteFluxAdapter(
	( { feed, site, translate, follow, feedId, siteId } ) => (
		<SubscriptionListItem
			isFollowing={ true }
			siteUrl={ follow.URL }
			siteTitle={ feed && feed.name }
			siteAuthor={ site && site.owner }
			siteExcerpt={ feed && feed.description }
			translate={ translate }
			feedId={ feedId }
			siteId={ siteId }
		/>
	)
) );
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
		let recommendations = ( this.state && this.state.recommendations ) || [];

		if ( recommendations.length === 0 ) {
			recommendations = sampleSize( recommendationsStore.get(), 2 );
		}

		return {
			recommendations
		};
	}

	render() {
		const { query, translate, follows } = this.props;
		const searchPlaceholderText = translate( 'Search millions of sites' );
		const recommendations = this.state.recommendations;
		// console.error( follows );
		const followsToShow = take( follows, 25 );

		return (
			<ReaderMain className="following-manage">
				{ this.props.showBack && <HeaderBack /> }
				{ this.props.follows.length === 0 && <QueryReaderFollows /> }
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
				{ map( followsToShow, follow =>
					<ConnectedFollowListItem
						key={ `follow-${ follow.URL }` }
						follow={ follow }
						feedId={ follow.feed_ID }
						siteId={ follow.blog_ID }
					/> // todo transform from feed_ID to feedId in data-layer??
				) }
			</ReaderMain>
		);
	}
}

export default connect(
	state => ( {
		follows: getReaderFollows( state )
	} ),
)(	localize( FollowingManage ) );
