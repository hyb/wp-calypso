import React, { PureComponent } from 'react';
import { localize } from 'i18n-calypso';
import { includes, map, partial } from 'lodash';

/**
 * Internal dependencies
 */
import Dialog from 'components/dialog';
import SectionNav from 'components/section-nav';
import SectionNavTabs from 'components/section-nav/tabs';
import SectionNavTabItem from 'components/section-nav/item';
import Search from 'components/search';

class LanguageChooserModal extends PureComponent {
	constructor( props ) {
		super( props );

		this.state = {
			filter: 'popular',
			search: false,
		};
	}

	getFilterLabel( filter ) {
		const { translate } = this.props;

		switch ( filter ) {
			case 'popular':
				return translate( 'Popular languages', { textOnly: true } );
			default:
				return translate( 'All languages', { textOnly: true } );
		}
	}

	getDisplayedLanguages() {
		const { languages } = this.props;
		const { search, filter } = this.state;

		if ( search ) {
			const searchString = search.toLowerCase();
			return languages.filter( language => {
				return includes( language.name.toLowerCase(), searchString );
			} );
		}

		switch ( filter ) {
			case 'popular':
				const popularLanguages = languages.filter( language => language.popular );
				popularLanguages.sort( ( a, b ) => a.popular - b.popular );
				return popularLanguages;
			default:
				return languages;
		}
	}

	handleSearch = ( search ) => {
		this.setState( { search } );
	}

	handleClick = ( langSlug ) => {
		this.props.onSelected && this.props.onSelected( langSlug );
	}

	renderTabItems() {
		const tabs = [ 'popular', '' ];

		return map( tabs, filter => {
			const selected = this.state.filter === filter;
			const onClick = () => this.setState( { filter } );

			return (
				<SectionNavTabItem
					key={ filter }
					selected={ selected }
					onClick={ onClick }
				>
					{ this.getFilterLabel( filter ) }
				</SectionNavTabItem>
			);
		} );
	}

	render() {
		const { isVisible, onClose, translate } = this.props;

		const languages = this.getDisplayedLanguages();

		const buttons = [
			{ action: 'cancel', label: translate( 'Cancel' ) },
			{ action: 'confirm', label: translate( 'Select' ), isPrimary: true },
		];

		return (
			<Dialog
				isVisible={ isVisible }
				buttons={ buttons }
				onClose={ onClose }
				additionalClassNames="language-chooser__modal"
			>
				<SectionNav selectedText={ this.getFilterLabel( this.state.filter ) }>
					<SectionNavTabs>
						{ this.renderTabItems() }
					</SectionNavTabs>
					<Search
						pinned
						fitsContainer
						onSearch={ this.handleSearch }
						placeholder={ translate( 'Search languages…' ) }
					/>
				</SectionNav>
				<div className="language-chooser__modal-list">
					{ languages.map( language => (
						<div
							className="language-chooser__modal-item"
							key={ language.langSlug }
							onClick={ partial( this.handleClick, language.langSlug ) }
						>
							{ language.name.split( ' - ' )[ 1 ] }
						</div>
					) ) }
				</div>
			</Dialog>
		);
	}
}

export default localize( LanguageChooserModal );
