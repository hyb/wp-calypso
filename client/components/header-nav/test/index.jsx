/**
 * External dependencies
 */
import { expect } from 'chai';
import React from 'react';
import { shallow } from 'enzyme';

/**
 * Internal dependencies
 */
import HeaderNav from '../';
import Item from '../item';

describe( 'HeaderNav', () => {
	const options = [
		{ label: 'sites', uri: '/sites' },
		{ label: 'more' }
	];

	it( 'should render a navigation bar given a list of options', () => {
		const headerNav = shallow( <HeaderNav options={ options } uri="" /> );
		const items = headerNav.find( Item );

		expect( items.length ).to.equal( 2 );
		expect( items.everyWhere( item => item.prop( 'isSelected' ) ) ).to.equal( false );
		expect( items.at( 0 ).prop( 'label' ) ).to.equal( 'sites' );
		expect( items.at( 1 ).prop( 'label' ) ).to.equal( 'more' );
	} );

	it( 'should mark an option with a matching URI as selected', () => {
		const headerNav = shallow( <HeaderNav options={ options } uri="/sites" /> );
		const items = headerNav.find( Item );

		expect( items.length ).to.equal( 2 );
		expect( items.at( 0 ).prop( 'label' ) ).to.equal( 'sites' );
		expect( items.at( 1 ).prop( 'label' ) ).to.equal( 'more' );
		expect( items.at( 0 ).prop( 'isSelected' ) ).to.equal( true );
		expect( items.at( 1 ).prop( 'isSelected' ) ).to.equal( false );
	} );
} );
