/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { noop } from 'lodash';

import Gridicon from 'gridicons';

export const Item = props => {
	const {
		isSelected,
		onClick,
		label,
		icon,
		href
	} = props;

	const classes = classNames(
		'header-nav__item',
		{ 'is-selected': isSelected }
	);

	return (
		<a
			href={ href }
			className={ classes }
			onClick={ onClick }
			aria-selected={ isSelected }
			role="menuitem">
			<Gridicon className="header-nav__icon" icon={ icon } size={ 24 } />
			<div className={ 'header-nav__label' }>
				{ label }
			</div>
		</a>
	);
};

Item.propTypes = {
	isSelected: PropTypes.bool,
	onClick: PropTypes.func,
	label: PropTypes.string.isRequired,
	icon: PropTypes.string,
	href: PropTypes.string.isRequired
};

Item.defaultProps = {
	isSelected: false,
	onClick: noop,
	icon: 'todo'
};

export default Item;
