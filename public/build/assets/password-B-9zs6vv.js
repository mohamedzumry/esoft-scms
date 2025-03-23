import{r as w,m as j,j as s,L as v}from"./app-BqgjSa7h.js";import{I as n}from"./input-error-Q341MQbw.js";import{A as _}from"./app-layout-DZa-I5H7.js";import{S as y,H as N}from"./layout-evFzOKBI.js";import{B as C}from"./button-f7xD2yd9.js";import{L as p,I as d}from"./label-JH_K8sT2.js";import{z as S}from"./transition-BeaITmUw.js";import"./index-B4bWSZca.js";import"./index-BQDKezta.js";import"./index-r0Qgb-MZ.js";import"./index-y_G3aFvS.js";import"./index-CHCWTLiE.js";import"./index-lXOJ2YE7.js";import"./index-Cj_Yjniq.js";import"./app-logo-icon-DHy56tQj.js";const b=[{title:"Password settings",href:"/settings/password"}];function G(){const i=w.useRef(null),c=w.useRef(null),{data:e,setData:a,errors:o,put:f,reset:t,processing:x,recentlySuccessful:h}=j({current_password:"",password:"",password_confirmation:""}),g=r=>{r.preventDefault(),f(route("password.update"),{preserveScroll:!0,onSuccess:()=>t(),onError:l=>{var m,u;l.password&&(t("password","password_confirmation"),(m=i.current)==null||m.focus()),l.current_password&&(t("current_password"),(u=c.current)==null||u.focus())}})};return s.jsxs(_,{breadcrumbs:b,children:[s.jsx(v,{title:"Profile settings"}),s.jsx(y,{children:s.jsxs("div",{className:"space-y-6",children:[s.jsx(N,{title:"Update password",description:"Ensure your account is using a long, random password to stay secure"}),s.jsxs("form",{onSubmit:g,className:"space-y-6",children:[s.jsxs("div",{className:"grid gap-2",children:[s.jsx(p,{htmlFor:"current_password",children:"Current password"}),s.jsx(d,{id:"current_password",ref:c,value:e.current_password,onChange:r=>a("current_password",r.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"current-password",placeholder:"Current password"}),s.jsx(n,{message:o.current_password})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(p,{htmlFor:"password",children:"New password"}),s.jsx(d,{id:"password",ref:i,value:e.password,onChange:r=>a("password",r.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"new-password",placeholder:"New password"}),s.jsx(n,{message:o.password})]}),s.jsxs("div",{className:"grid gap-2",children:[s.jsx(p,{htmlFor:"password_confirmation",children:"Confirm password"}),s.jsx(d,{id:"password_confirmation",value:e.password_confirmation,onChange:r=>a("password_confirmation",r.target.value),type:"password",className:"mt-1 block w-full",autoComplete:"new-password",placeholder:"Confirm password"}),s.jsx(n,{message:o.password_confirmation})]}),s.jsxs("div",{className:"flex items-center gap-4",children:[s.jsx(C,{disabled:x,children:"Save password"}),s.jsx(S,{show:h,enter:"transition ease-in-out",enterFrom:"opacity-0",leave:"transition ease-in-out",leaveTo:"opacity-0",children:s.jsx("p",{className:"text-sm text-neutral-600",children:"Saved"})})]})]})]})})]})}export{G as default};
