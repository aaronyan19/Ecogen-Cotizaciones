#!/bin/bash
cd "$(dirname "$0")" || exit 1
node probar.mjs
read -r -p "Pulsa Enter para cerrar."
