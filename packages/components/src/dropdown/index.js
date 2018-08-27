/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import Popover from '../popover';

class Dropdown extends Component {
	constructor() {
		super( ...arguments );
		this.toggle = this.toggle.bind( this );
		this.close = this.close.bind( this );
		this.clickOutside = this.clickOutside.bind( this );
		this.bindContainer = this.bindContainer.bind( this );
		this.state = {
			isOpen: false,
		};
	}

	componentWillUnmount() {
		const { isOpen } = this.state;
		const { onToggle } = this.props;
		if ( isOpen && onToggle ) {
			onToggle( false );
		}
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isOpen } = this.state;
		const { onToggle } = this.props;
		if ( prevState.isOpen !== isOpen && onToggle ) {
			onToggle( isOpen );
		}
	}

	bindContainer( ref ) {
		this.container = ref;
	}

	toggle() {
		this.setState( ( state ) => ( {
			isOpen: ! state.isOpen,
		} ) );
	}

	clickOutside( event ) {
		if ( ! this.container.contains( event.target ) ) {
			this.close();
		}
	}

	close() {
		this.setState( { isOpen: false } );
	}

	render() {
		const { isOpen } = this.state;
		const {
			renderContent,
			renderToggle,
			noArrow = false,
			position = 'bottom',
			className,
			contentClassName,
			expandOnMobile,
			headerTitle,
		} = this.props;

		const args = { isOpen, onToggle: this.toggle, onClose: this.close };
		const content = renderContent( args );

		return (
			<div className={ className } ref={ this.bindContainer }>
				{ /**
				   * This seemingly redundant wrapper node avoids root return
				   * element styling impacting popover positioning.
				   */ }
				<div>
					{ renderToggle( args ) }
					{ isOpen && position !== 'inline' && (
						<Popover
							className={ contentClassName }
							position={ position }
							onClose={ this.close }
							onClickOutside={ this.clickOutside }
							expandOnMobile={ expandOnMobile }
							headerTitle={ headerTitle }
							noArrow={ noArrow }
						>
							{ content }
						</Popover>
					) }
					{ isOpen && position === 'inline' && (
						<div className={ classnames( 'components-dropdown__inline-content', contentClassName ) }>
							{ content }
						</div>
					) }
				</div>
			</div>
		);
	}
}

export default Dropdown;
