import { InfoOutlined } from '@mui/icons-material';
import { FormControl, FormLabel, Select, FormHelperText } from '@mui/joy';
import React, { InputHTMLAttributes } from 'react'
import { FieldError } from 'react-hook-form';
import Option from '@mui/joy/Option';

interface SelectProps {
    fieldName: string;
    fieldError: FieldError | undefined,
    label: string,
    placeholder: string,
    options: { label: string, value: string }[],
    setValue: any
};

function SelectField({ fieldError, label, placeholder, options, setValue, fieldName, }: SelectProps) {
    return (
        <FormControl sx={{ my: 1 }}>
            <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                {label}
            </FormLabel>
            <Select placeholder={placeholder} onChange={(_, value) => setValue(value)}
                sx={fieldError?.message ? { borderColor: "red", color: "red" } : {}} >
                {options.map(({ value, label }, key) => (<Option value={value} key={key}>{label}</Option>))}
            </Select>
            {
                fieldError?.message && (
                    <FormHelperText sx={{ color: "red" }}>
                        <InfoOutlined color="error" />
                        {fieldError.message}
                    </FormHelperText>
                )
            }
        </FormControl >
    )
}

export default SelectField