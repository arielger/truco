import React from "react";
import { Field, FieldProps } from "formik";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import styles from "./NewMatch.module.scss";

type RadioProps = {
  id: string;
  text: string;
  className?: string;
  disabled?: boolean;
  [x: string]: any;
};

const Radio = ({
  id,
  text,
  className = "",
  disabled,
  ...props
}: RadioProps) => (
  <>
    <Field type="radio" id={id} {...props}>
      {({ field }: FieldProps) => {
        const isChecked = field.checked;

        return (
          <div className="relative">
            <input
              type="radio"
              id={id}
              className="opacity-0 absolute"
              disabled={disabled}
              {...field}
            />
            <label
              htmlFor={id}
              className={`
                  ${styles.radioLabel}
                  h-10 w-full rounded border flex items-center justify-between px-3
                  ${
                    disabled
                      ? "text-gray-600 cursor-not-allowed border-gray-300"
                      : "text-black cursor-pointer border-gray-400"
                  }
                  ${className}
                `}
            >
              <div className="flex items-center">
                <span
                  className={`
                    ${styles.iconContainer}
                    w-5 h-5 mr-3 text-sm rounded-full inline-flex items-center justify-center
                    ${disabled ? "bg-gray-200" : "bg-gray-300"}
                `}
                >
                  {isChecked && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: "0.625em" }}
                      className={`${styles.radioIcon} text-white`}
                    />
                  )}
                </span>
                <span className="text-sm whitespace-no-wrap">{text}</span>
              </div>
              {disabled && (
                <span
                  className={`inline-block font-medium text-white rounded-full px-3 uppercase bg-orange-500 ${styles.comingSoon}`}
                >
                  Proximamente
                </span>
              )}
            </label>
          </div>
        );
      }}
    </Field>
  </>
);

export default Radio;
