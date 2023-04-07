import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {
    Sports,
    SportsVolleyball,
    SportsHandball,
    Timer
} from '@mui/icons-material';
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
        <Grid item xs={12} md={6}>
            <Card sx={{ maxWidth: 820, justifyContent: 'center' }}>
                <CardActionArea href={path}>
                    <CardContent sx={{ justifyContent: 'center', flexDirection: 'column' }}>
                        <Typography sx={{ fontSize: 24, alignSelf: 'center', textAlign: 'center' }} color="text.secondary">
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
            return <Sports sx={{ fontSize: size }} />
        case 'volleyball':
            return <SportsVolleyball sx={{ fontSize: size }} />
        case 'timer':
            return <Timer sx={{ fontSize: size }} />
        case 'player':
            return <SportsHandball sx={{ fontSize: size }} />

        // all other supported icons 
    }
}

export default AppCards;
