import React from 'react';
import SideNav, { Nav, NavIcon, NavText } from 'react-sidenav';
import SvgIcon from 'react-icons-kit';

import { ic_fiber_new } from 'react-icons-kit/md/ic_fiber_new';       
import { ic_list } from 'react-icons-kit/md/ic_list';       
import styled from 'styled-components'


const Aside = styled.aside`
    background: #888;
    flex-direction: column;
    display: flex;
    justify-content: flex-end;
    width: 2rem;
    height: 100%; 
    width: 50px; 
`;

const FlexSvgIcons = styled(SvgIcon)`
flex: 1;
`;

const CustomSideNav = () => (
    <Aside>
        <FlexSvgIcons size={48} icon={ic_list}/>
        <FlexSvgIcons size={48} icon={ic_fiber_new}/>
    </Aside>

)



export default CustomSideNav;
