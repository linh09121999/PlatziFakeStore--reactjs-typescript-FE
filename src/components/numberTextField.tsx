import React from "react";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

interface NumberTextFieldProps extends Omit<TextFieldProps, "value" | "onChange"> {
    value: number;
    onChange: (n: number) => void;
    min?: number;
    max?: number;
    step?: number;
    startAdornment?: React.ReactNode;
}

const NumberTextField: React.FC<NumberTextFieldProps> = ({
    value,
    onChange,
    min = -Infinity,
    max = Infinity,
    step = 1,
    sx,
    startAdornment,
    ...rest
}) => {
    const toNumber = (str: string): number => {
        if (str === "" || str == null) return NaN;
        const normalized = String(str).replace(/[^\d\-\.]/g, "");
        const n = normalized === "" ? NaN : Number(normalized);
        return Number.isFinite(n) ? n : NaN;
    };

    const clamp = (n: number): number => {
        if (!Number.isFinite(n)) return n;
        if (n < min) return min;
        if (n > max) return max;
        return n;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const n = toNumber(raw);
        if (Number.isFinite(n)) {
            onChange(clamp(n));
        } else {
            onChange(NaN);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const allowed =
            e.key === "Backspace" ||
            e.key === "Delete" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight" ||
            e.key === "Tab" ||
            e.key === "Enter" ||
            e.key === "-" ||
            e.key === ".";

        if (allowed) return;

        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
        e.preventDefault();
        const diff = e.deltaY < 0 ? 1 : -1;
        const current = Number.isFinite(value) ? value : 0;
        const next = clamp(current + diff * step);
        onChange(next);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const text = e.clipboardData.getData("text");
        const n = toNumber(text);
        if (!Number.isFinite(n)) {
            e.preventDefault();
        }
    };

    return (
        <TextField
            {...rest}
            value={Number.isFinite(value) ? String(value) : ""}
            variant="outlined"
            sx={sx}
            slotProps={{
                input: {
                    startAdornment: startAdornment ? (
                        <InputAdornment position="start">{startAdornment}</InputAdornment>
                    ) : undefined,
                    inputProps: {
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                    },
                    onChange: handleInputChange,
                    onKeyDown: handleKeyDown,
                    onWheel: handleWheel,
                    onPaste: handlePaste,
                    title: "Nhập số hoặc cuộn chuột để tăng/giảm",
                    style: { MozAppearance: "textfield" } as React.CSSProperties,
                },
            }}
        />
    );
}

export default NumberTextField