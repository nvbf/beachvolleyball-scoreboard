import { Button } from 'react-bootstrap' 
import styled from 'styled-components'


//TODO: no extra stuff is done here, should just use Button
export default ({handleClick, value, disabled, color}) => (

    <div>
        <Button
            type="submit"
            className={(disabled ? "disabled": "")}
            onClick={handleClick} 
        >
            {value}
        </Button>
    </div>
)
