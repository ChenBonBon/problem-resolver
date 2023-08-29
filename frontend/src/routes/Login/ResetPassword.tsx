import { TextField } from "@radix-ui/themes";
import { ChangeEvent, useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToggle } from "react-use";
import Button from "../../components/Button";
import FormItem from "../../components/FormItem";
import useToast from "../../hooks/useToast";
import LoginLayout from "../../layouts/LoginLayout";
import { resetPassword } from "../../requests/user";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [form, setForm] = useState({
        password: "",
        confirmPassword: "",
    });
    const [passwordError, togglePasswordError] = useToggle(false);
    const [confirmPasswordError, toggleConfirmPasswordError] = useToggle(false);
    const [confirmPasswordErrorText, setConfirmPasswordErrorText] =
        useState("");

    const { showToast } = useToast();

    const onChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>, key: string) => {
            setForm({
                ...form,
                [key]: e.target.value,
            });
        },
        [form]
    );

    const passwordChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e, "password");
        },
        [onChange]
    );

    const confirmPasswordChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e, "confirmPassword");
        },
        [onChange]
    );

    const reset = useCallback(async () => {
        if (form.password.length === 0) {
            togglePasswordError(true);
            return;
        } else {
            togglePasswordError(false);
        }

        if (form.confirmPassword.length === 0) {
            setConfirmPasswordErrorText("请再次输入新密码");
            toggleConfirmPasswordError(true);
            return;
        } else {
            if (form.password !== form.confirmPassword) {
                setConfirmPasswordErrorText("两次输入的密码不一致");
                toggleConfirmPasswordError(true);
                return;
            } else {
                toggleConfirmPasswordError(false);
            }
        }

        const res = await resetPassword(
            form.password,
            searchParams.get("stoken") ?? ""
        );

        if (res && res.code === 0) {
            showToast("success", "密码重置成功");
            navigate("/login");
        }
    }, [
        form.confirmPassword,
        form.password,
        navigate,
        searchParams,
        showToast,
        toggleConfirmPasswordError,
        togglePasswordError,
    ]);

    return (
        <LoginLayout>
            <FormItem
                required
                errorText="请输入新密码"
                status={passwordError ? "error" : "success"}
            >
                <TextField.Input
                    placeholder="输入新密码"
                    onChange={passwordChange}
                    type="password"
                />
            </FormItem>
            <FormItem
                required
                errorText={confirmPasswordErrorText}
                status={confirmPasswordError ? "error" : "success"}
            >
                <TextField.Input
                    placeholder="再次输入新密码"
                    onChange={confirmPasswordChange}
                    type="password"
                />
            </FormItem>
            <Button onClick={reset}>重置密码</Button>
        </LoginLayout>
    );
}
