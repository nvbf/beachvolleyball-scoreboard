import React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SportsIcon from '@mui/icons-material/Sports';
import SportsVolleyballIcon from '@mui/icons-material/SportsVolleyball';
import SportsHandballIcon from '@mui/icons-material/SportsHandball';
import TimerIcon from '@mui/icons-material/Timer';






import {
    Card,
    CardActionArea,
    CardContent,
} from "@mui/material";

interface AppCardsProps {
    title: string,
    subHeader: string,
    path: string,
    iconName: string,
    size: number,
}

const IMAGES = {
    cardImage: new URL('../static/img/match.jpg', import.meta.url).href
}

export function AppCards({ title, subHeader, path, iconName, size }: AppCardsProps) {
    return (
        <Grid xs={12} md={6} item>
            <Card sx={{ maxWidth: 820, display: 'flex', justifyContent: 'center' }}>
                <CardActionArea href={path}>
                    <CardContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center' }} variant="h1" color="text.secondary" gutterBottom>
                            {getIconFromName(iconName, size)}
                        </Typography>
                        <Typography sx={{ alignSelf: 'center', textAlign: 'center' }} variant="h4" component="div">
                            {title}
                        </Typography>

                        <Typography sx={{ mb: 1.5, alignSelf: 'center', textAlign: 'center' }} color="text.secondary">
                            {subHeader}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

const getIconFromName = (iconName: string, size: number) => {
    switch (iconName) {
        case 'flute':
            return <SportsIcon sx={{ fontSize: size }} />
        case 'volleyball':
            return <SportsVolleyballIcon sx={{ fontSize: size }} />
        case 'timer':
            return <TimerIcon sx={{ fontSize: size }} />
        case 'player':
            return <SportsHandballIcon sx={{ fontSize: size }} />

        // all other supported icons 
    }
}

export default AppCards;
