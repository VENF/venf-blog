## 1. Foundation — types.ts + metadata

- [x] 1.1 Extender `FieldDef` en `plugins/types.ts` con `metadata?: Record<string, unknown>`

## 2. Expandir text.plugin.tsx — 7 variantes

- [x] 2.1 Refactorizar `text.plugin.tsx` para usar `InputGroup` + dispatch por `metadata.variant`
- [x] 2.2 Implementar variante `basic` (default, mismo comportamiento actual)
- [x] 2.3 Implementar variante `error` con `aria-invalid` + mensaje de error
- [x] 2.4 Implementar variante `icon-start` con icono leading (InputGroupAddon)
- [x] 2.5 Implementar variante `icon-end` con icono trailing
- [x] 2.6 Implementar variante `addons` con texto/botones a ambos lados
- [x] 2.7 Implementar variante `button` con botón inline
- [x] 2.8 Implementar variante `character-limit` con contador n/max

## 3. Expandir textarea.plugin.tsx — variantes error + character-limit

- [x] 3.1 Implementar variante `error` con `aria-invalid` + mensaje de error
- [x] 3.2 Implementar variante `character-limit` con contador n/max
- [x] 4.1 Implementar variante `icon` con icono leading via `NativeSelect` + metadata.icon

## 5. Crear password.plugin.tsx

- [x] 5.1 Implementar input con toggle de visibilidad (eye/eye-off icon)
- [x] 5.2 Implementar barra de fortaleza de 5 segmentos con Progress
- [x] 5.3 Implementar checklist de 5 requisitos (mayúscula, minúscula, número, especial, min 12)
- [x] 5.4 Implementar buildSchema con `z.string().min(12).regex(x4)`
- [x] 5.5 Crear PasswordSkeleton

## 6. Crear otp.plugin.tsx

- [x] 6.1 Implementar wrapper sobre InputOTP existente
- [x] 6.2 Implementar temporizador de reenvío opcional (metadata.resendAfter)
- [x] 6.3 Implementar buildSchema con `z.string().length(slots)`
- [x] 6.4 Crear OTPSkeleton

## 7. Crear radio.plugin.tsx

- [x] 7.1 Implementar RadioGroup + RadioGroupItem × field.options[]
- [x] 7.2 Implementar buildSchema con `z.enum(options)`
- [x] 7.3 Crear RadioSkeleton

## 8. Crear checkbox-group.plugin.tsx

- [x] 8.1 Implementar Checkbox × field.options[] retornando string[]
- [x] 8.2 Implementar buildSchema con `z.array(z.string()).min(1)` si required
- [x] 8.3 Crear CheckboxGroupSkeleton

## 9. Crear switch.plugin.tsx

- [x] 9.1 Implementar wrapper sobre Switch component
- [x] 9.2 Implementar buildSchema con `z.boolean()` + .refine si required
- [x] 9.3 Crear SwitchSkeleton

## 10. Crear slider.plugin.tsx

- [x] 10.1 Implementar slider single (metadata.mode='single') con display de valor
- [x] 10.2 Implementar slider range (metadata.mode='range') con display de rango
- [x] 10.3 Implementar buildSchema: `z.number()` o `z.tuple([z.number(), z.number()])`
- [x] 10.4 Crear SliderSkeleton

## 11. Crear multi-select UI component + plugin

- [x] 11.1 Crear `@/components/ui/multi-select.tsx` con MultipleSelector (cmdk + Command)
- [x] 11.2 Implementar `multi-select.plugin.tsx` con MultipleSelector wrapper
- [x] 11.3 Implementar buildSchema con `z.array(z.string()).min(1)` si required
- [x] 11.4 Crear MultiSelectSkeleton

## 12. Crear phone-input UI component + plugin

- [x] 12.1 Instalar `react-phone-number-input` y crear `@/components/ui/phone-input.tsx`
- [x] 12.2 Implementar `phone.plugin.tsx` como wrapper
- [x] 12.3 Implementar buildSchema con `z.string()`
- [x] 12.4 Crear PhoneSkeleton

## 13. Crear masked-time.plugin.tsx

- [x] 13.1 Instalar `use-mask-input`
- [x] 13.2 Implementar input con mask HH:MM:ss via use-mask-input
- [x] 13.3 Implementar buildSchema con `z.string().regex(/^\d{2}:\d{2}:\d{2}$/)`
- [x] 13.4 Crear MaskedTimeSkeleton

## 14. Crear number-stepper.plugin.tsx

- [x] 14.1 Instalar `react-aria-components`
- [x] 14.2 Implementar NumberField con botones -/+ y atajos de teclado
- [x] 14.3 Implementar buildSchema con `z.number().min(field.min).max(field.max)`
- [x] 14.4 Crear NumberStepperSkeleton

## 15. Crear card-details.plugin.tsx

- [x] 15.1 Instalar `react-payment-inputs`
- [x] 15.2 Implementar 3 campos anidados (card number, expiry, CVC) retornando objeto
- [x] 15.3 Implementar buildSchema con `z.object({ cardNumber, expiry, cvc })`
- [x] 15.4 Crear CardDetailsSkeleton

## 16. Registrar plugins + verificar build

- [x] 16.1 Registrar los 14 plugins en `plugins/registry.ts`
- [x] 16.2 Ejecutar `npm run typecheck`
- [x] 16.3 Ejecutar `npm run lint`
