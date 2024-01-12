import { InfoOutlined } from '@mui/icons-material';
import { Autocomplete, FormControl, FormHelperText, FormLabel } from '@mui/joy'
import React from 'react'
import { FieldError } from 'react-hook-form';

interface AutoCompleteFieldProps {
    options: { label: string, value: any }[],
    placeholder: string,
    setValue: any,
    fieldError: FieldError | undefined,
    label: string,
    defaultValue?: any
}

function AutoCompleteField({ options, placeholder, setValue, defaultValue, fieldError, label }: AutoCompleteFieldProps) {
    return (
        <FormControl sx={{ my: 1 }}>
            <FormLabel id="select-field-demo-label" htmlFor="select-field-demo-button">
                {label}
            </FormLabel>
            <Autocomplete error={Boolean(fieldError?.message)}
                clearOnEscape={true}
                onInputChange={(_, text) => !text && setValue(null)}
                onChange={(_, option) => setValue(option.value)}
                type="search"
                disableClearable
                placeholder={placeholder}
                isOptionEqualToValue={(option, value) => option.value === value.value}
                options={options}
                defaultValue={defaultValue}
            />
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

export default AutoCompleteField