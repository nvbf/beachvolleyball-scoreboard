import React from "react";
import AppBar from "@mui/material/AppBar";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

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

const IMAGES = {
    cardImage : new URL('../static/img/match.jpg', import.meta.url).href
}

export function AppCards({ title, subHeader, path }: AppCardsProps) {
    return (
        <Grid item>
            <Card sx={{ maxWidth: 820 }}>
                <CardActionArea href={path}>
                    <CardMedia
                        component="img"
                        src={IMAGES.cardImage}
                        alt="Beacvolleyballcourt"
                    />
                    <CardHeader
                        title={title}
                        subheader={subHeader}
                    />
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default AppCards;
