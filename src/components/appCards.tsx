import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import cardImage from '../static/img/match.jpg'
import Link from '@mui/material/Link';
import {
    Card,
    CardHeader,
    CardMedia,
    CardActionArea,
} from "@mui/material";

interface AppCardsProps {
    title: string,
    subHeader: string,
    path: string
}

export function AppCards({ title, subHeader, path }: AppCardsProps) {
    return (
        <Card sx={{ maxWidth: 820 }}>
            <CardActionArea href={path}>
                <CardHeader
                    title={title}
                    subheader={subHeader}
                />
                <CardMedia
                    component="img"
                    src={cardImage}
                    alt="Beacvolleyballcourt"
                />
            </CardActionArea>
        </Card>
    )
}

export default AppCards;
