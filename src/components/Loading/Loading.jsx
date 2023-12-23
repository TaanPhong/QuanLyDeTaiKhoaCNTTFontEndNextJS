import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Context } from '@/context/Context';

export default function Loading() {
    const context = React.useContext(Context)

    return (
        <div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={context.showLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}