# SAXA CADENTIA — mekanik-inventarium (Steg 3)

Härlett ur de 12 nivåkoncepten. Markerar status: **[klar]** (Steg 2), **[stub]** (ska byggas i Steg 4).
"Primitivast möjligt" i Steg 4 = funktionell rektangel/cirkel-grafik, ingen animation utöver
omritning per drag, enklast tänkbara regel.

## A. Kärnrörelse & värld
1. **Rutnätsrörelse** (4-riktning) — [klar]
2. **Gräv grus** (`.` → luft när man går in) — [klar]
3. **Lyktans ljusradie / mörker** (fog-of-war) — [klar]
4. **Murar blockerar** — [klar]
5. **Utgång** (`X`) → nästa nivå — [stub] (just nu bara flash)

## B. Boulder-Dash-fysik
6. **Gravitation** — lösa stenar (`O`, `*`) faller när rutan under är luft — [stub]
7. **Krossning** — sten som faller på Dante = död/reset — [stub]
8. **Knuffa sten** i sidled om rutan bortom är luft — [stub]
9. **Släpp-i-slott** — sten som faller/knuffas in i ett altarslott (`S`) räknas som leverans — [stub]

## C. Latin-kärnan (formkontroll)
10. **Paradigm-generator** — slumpa (stam, målform) ur poolen; producera korrekt facit + distraktorer — [stub]
11. **Fragment-etiketter** — varje `*`-sten får en ändelse/ord (en rätt, övriga fel) — [stub]
12. **Leverans-validering** — rätt fragment i slott → "ord tänds", räknas; fel → splittras — [stub]
13. **Måluppfyllelse** — N korrekta former → kammaren klar — [stub]
14. **Säkerhetsmätare** — rätt-i-rad / träffsäkerhet denna session — [stub]

## D. Mål-varianter (slott-typer)
15. **Enkelslott** (1 ändelse) — Limbo, Avaritia m.fl. — [stub]
16. **Trippelmål** (Cerberus tre strupar) — tre personformer — [stub]
17. **Två-slots-kongruens** (substantiv + adjektiv, matcha genus) — Haeresis — [stub]
18. **Ordnings-slots** (lägg ord-stenar i rätt sekvens) — Fraus, Boss — [stub]

## E. Hot & faror (per nivå)
19. **Roamande fiende / jagare** (väckt skugga, Minotauros) — patrull/jakt-AI — [stub]
20. **Lunge-timer** (Cerberus slår bort buren sten) — [stub]
21. **Vindpust** (periodisk lateral stöt på lösa stenar) — Luxuria — [stub]
22. **Stigande vatten** (Styx; drunkning = reset) — Ira — [stub]
23. **Sjunkande istak** (tidspress) — Boss — [stub]
24. **Flammande gravar / skiftande mark** (rörlig fara/förflyttning) — Haeresis/Fraus — [stub]

## F. Ramverk
25. **Nivåväljare** — [klar]
26. **Intro/HUD/flash** — [klar]
27. **Mobil: svep + d-pad** — [klar]
28. **Reset/omstart av kammare** (efter död) — [stub]
29. **Integration: nå Ludus från huvudkartan** — [stub] (länk finns i ludus → tillbaka)

---

## Steg 4 — byggordning (primitivast först, minst beroenden)
1. **Gravitation + krossning + knuff** (6,7,8) — Boulder-Dash-kärnan; gör världen "levande".
2. **Paradigm-generator + fragment-etiketter + leverans-validering** (10,11,12,9) — Latin-kärnan; gör Limbo spelbar end-to-end.
3. **Måluppfyllelse + säkerhetsmätare + utgång + reset** (13,14,5,28) — loopen sluts (en hel nivå klarbar).
4. **Mål-varianter** (16,17,18) — Cerberus/kongruens/ordning.
5. **Faror** (19–24) — en per nivå, enklast form.
6. **Integration** (29) — länk från Inferno-kartan.

Vertikal skiva (minsta spelbara) = punkt 1–3 på **Limbo** → en hel kammare man kan klara
genom att faktiskt forma rätt latin. Det byggs först och speltestas innan resten.
