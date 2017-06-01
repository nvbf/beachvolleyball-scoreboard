import React,{Component} from 'react';

class SecondCounter extends Component {
    constructor(props) {
        super(props)
        this.state = { counter: 0 }
        this.count = this.count.bind(this)
    }

    count = () => this.setState({counter : this.state.counter + 1})

    componentDidMount() {
        this.ref = setInterval(this.count, 1000)
    } 

    componentWillUnmount() {
        clearInterval(this.ref)
    } 

	render() {
        return <span> {this.state.counter} </span>
    }
}


export default SecondCounter