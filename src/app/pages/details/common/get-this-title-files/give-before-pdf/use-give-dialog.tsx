import React from 'react';
import {useDialog} from '~/components/dialog/dialog';
import GiveBeforePdf from './give-before-pdf';
import GiveBeforeOther from './give-before-other';
import useDonationPopupData from './use-donation-popup-data';
import {isMobileDisplay} from '~/helpers/device';

export default function useGiveDialog() {
    const [Dialog, open, close] = useDialog();
    const data = useDonationPopupData();

    const GiveDialog = React.useCallback(
        ({
            link,
            track,
            onDownload,
            variant
        }: {
            link: string;
            track?: string;
            onDownload?: (e: React.MouseEvent) => void;
            variant?: string;
        }) => {
            const Variant = lookupVariant(variant) as typeof GiveBeforeOther;

            return (
                <Dialog>
                    <Variant {...{link, track, close, data, onDownload, variant}} />
                </Dialog>
            );
        },
        [close, data, Dialog]
    );

    return {
        GiveDialog,
        open,
        enabled: !data.hide_donation_popup
    };
}

export function useOpenGiveDialog() {
    const {GiveDialog, open, enabled} = useGiveDialog();
    const openGiveDialog = React.useCallback(
        (event: React.MouseEvent) => {
            if (enabled && !isMobileDisplay()) {
                event.preventDefault();
                open();
            }
        },
        [enabled, open]
    );

    return {GiveDialog, openGiveDialog};
}

function lookupVariant(variant: string | undefined) {
    if (variant !== undefined) {
        return GiveBeforeOther;
    }
    return GiveBeforePdf;
}
