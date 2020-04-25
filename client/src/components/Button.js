import React from 'react'

// @TODO: Add types, loading state (for now its only the CTA style)

export default function Button({ className, ...props }) {
    return (
        <button
            className={`h-12 bg-blue-500 hover:bg-blue-400 focus:bg-blue-400 rounded text-lg text-white w-full font-medium focus:outline-none ${className}`}
            {...props}
        />
    );
}
