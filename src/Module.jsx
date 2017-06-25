const React = require('react');
const CSS = require('react-css-modules');
const Hammer = require('react-hammerjs');
const {INPUT_MOVE, INPUT_END} = (typeof window === 'undefined') ? {} : require('hammerjs');
const Io = require('./Io.jsx');

const styles = require('./Module.pcss');

class Module extends React.Component {
	constructor(props, state) {
		super(props, state);

		this.state = {
			x: props.initialX,
			y: props.initialY,
			name: 'New Module',
			isWirePanning: false,
			isPanning: false,
			panDistance: null,
			panAngle: null,
			io: [{
				direction: 'in',
				name: 'Some Input',
			}, {
				direction: 'out',
				name: 'Some Output',
			}],
		};
	}

	handlePan = (event) => {
		event.preventDefault();

		if (event.target !== this.node || this.state.isWirePanning) {
			return;
		}

		const distance = event.distance;
		const angle = event.angle / 180 * Math.PI;
		console.log(event.eventType);

		if (event.eventType === INPUT_MOVE) {
			this.setState({
				isPanning: true,
				panDistance: distance,
				panAngle: angle,
			});
		} else if (event.eventType === INPUT_END) {
			this.setState({
				isPanning: false,
				x: this.state.x + distance * Math.cos(angle),
				y: this.state.y + distance * Math.sin(angle),
			});
		}
	}

	handleNameInput = (event) => {
		this.setState({
			name: event.target.textContent,
		});
	}

	handleIoPaninngStateChange = (isWirePanning) => {
		this.setState({isWirePanning});
	}

	getCoordinates = () => {
		if (this.state.isPanning) {
			return {
				x: this.state.x + this.state.panDistance * Math.cos(this.state.panAngle),
				y: this.state.y + this.state.panDistance * Math.sin(this.state.panAngle),
			};
		}

		return {
			x: this.state.x,
			y: this.state.y,
		};
	}

	render() {
		const {x, y} = this.getCoordinates();

		return (
			<Hammer onPan={this.handlePan} options={{domEvents: true}}>
				<div
					ref={(node) => {
						this.node = node;
					}}
					styleName="module"
					style={{
						transform: `translate(${x}px, ${y}px)`,
					}}
				>
					<div
						suppressContentEditableWarning={true}
						onInput={this.handleNameInput}
						styleName="name"
						contentEditable={true}
					>
						{this.state.name}
					</div>
					<div>
						{this.state.io.map((io) => (
							<Io
								key={io.name}
								name={io.name}
								direction={io.direction}
								onPanningStateChange={this.handleIoPaninngStateChange}
							/>
						))}
					</div>
				</div>
			</Hammer>
		);
	}
}

module.exports = CSS(Module, styles, {allowMultiple: true});
