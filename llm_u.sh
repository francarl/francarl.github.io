#!/usr/bin/env bash

# Arresta lo script in caso di errori
set -e

# ==========================================
# CONFIGURAZIONE VARIABILI
# ==========================================
VERSION="IQ3_XS" # Valori possibili: "IQ3_XS"

LLAMA_VERSION="v0.4.0"
CTX_SIZE="32768"
USE_VISION="true"
USE_CHAT_TEMPLATE="true"
ENABLE_MTP="false"
MODEL_DIR="HauhauCS/Qwen3.8-27B-Uncensored-HauhauCS-Aggressive-MTP-GGUF"
CACHE_TYPE="q4_0"

# Parsing args
while [ $# -gt 0 ]; do
  case "$1" in
    --version)
      VERSION="$2"
      shift 2
      ;;
    --enable-mtp)
      ENABLE_MTP="$2"
      shift 2
      ;;
    --use-vision)
      USE_VISION="$2"
      shift 2
      ;;
    --cache-type)
      CACHE_TYPE="$2"
      shift 2
      ;;
    --ctx-size)
      CTX_SIZE="$2"
      shift 2
      ;;
    --help)
      echo "Usage: --version <V> (default IQ3_XS) --enable-mtp <true|false> (default false) --use-vision <true|false> (default false) --cache-type <T> (default q4_0) --ctx-size <N> (default 131072)"
      exit 1
      ;;
    *)
      echo "Not valid option: $1"
      exit 1
      ;;
  esac
done
N_CPU_MOE=0
NGL="auto"
# Configurazione del modello in base alla versione scelta
MODEL="Qwen3.8-27B-Uncensored-HauhauCS-Aggressive-${VERSION}.gguf"

printf '%-20s %s\n' \
  "VERSION"          "$VERSION" \
  "LLAMA_VERSION"    "$LLAMA_VERSION" \
  "CTX_SIZE"         "$CTX_SIZE" \
  "USE_VISION"       "$USE_VISION" \
  "USE_CHAT_TEMPLATE" "$USE_CHAT_TEMPLATE" \
  "ENABLE_MTP"       "$ENABLE_MTP" \
  "MODEL_DIR"        "$MODEL_DIR" \
  "CACHE_TYPE"       "$CACHE_TYPE" \
  "N_CPU_MOE"        "$N_CPU_MOE" \
  "NGL"              "$NGL" \
  "MODEL"            "$MODEL"

# Configurazione argomento MoE
if [ "$N_CPU_MOE" -ne 0 ]; then
    VAR_N_CPU_MOE="--n-cpu-moe $N_CPU_MOE"
else
    VAR_N_CPU_MOE=""
fi

# ==========================================
# INSTALLAZIONE E DOWNLOAD DIPENDENZE
# ==========================================
echo "Installazione di huggingface_hub e hf_transfer..."
pip install -U huggingface_hub hf_transfer

echo "Download di nviwatch..."
wget -q --show-progress https://github.com/msminhas93/nviwatch/releases/download/v0.2.4/nviwatch
chmod +x nviwatch

echo "Download del modello HF in corso..."
hf download "$MODEL_DIR" \
    --local-dir "$MODEL_DIR" \
    --include "*$MODEL*" \
    --include "*mmproj-Qwen3.8-27B-Uncensored-HauhauCS-Aggressive-BF16.gguf*" 
echo "Download modello completato."

echo "Download del template di chat..."
hf download froggeric/Qwen-Fixed-Chat-Templates \
    --local-dir . \
    --include "chat_template.jinja"

echo "Download e estrazione di llama.cpp server..."
wget -q --show-progress "https://github.com/ai-dock/llama.cpp-cuda/releases/download/${LLAMA_VERSION}/llama.cpp-${LLAMA_VERSION}-cuda-12.8-amd64.tar.gz"
tar -xvf "llama.cpp-${LLAMA_VERSION}-cuda-12.8-amd64.tar.gz"
echo "Download llama.cpp server completato."

git clone https://github.com/MiniMax-AI/MiniMax-H3/
mv MiniMax-H3/skills/h3-prompt-writing /content
rm -rf MiniMax-H3

echo "Download di MINIMAX_H3_REFMODS_INSTALLATION_AND_USAGE_GUIDE.md..."
wget -q --show-progress "https://huggingface.co/datasets/malcolmrey/various/resolve/main/h3-center/docs/MINIMAX_H3_REFMODS_INSTALLATION_AND_USAGE_GUIDE.md" \
    -O "MINIMAX_H3_REFMODS_INSTALLATION_AND_USAGE_GUIDE.md"

echo "Starting llama-server..."
# Costruzione opzioni condizionali
CHAT_TEMPLATE_ARG=""
if [ "$USE_CHAT_TEMPLATE" = "true" ]; then
    CHAT_TEMPLATE_ARG="--chat-template-file ./chat_template.jinja"
fi

MTP_ARG=""
if [ "$ENABLE_MTP" = "true" ]; then
    MTP_ARG="--spec-type draft-mtp --spec-draft-n-max 4"
fi

MMPROJ_ARG=""
if [ "$USE_VISION" = "true" ]; then
    MMPROJ_ARG="--mmproj $MODEL_DIR/mmproj-Qwen3.8-27B-Uncensored-HauhauCS-Aggressive-BF16.gguf"
fi

# Avvio di llama-server
export LD_LIBRARY_PATH=/usr/lib64-nvidia
LD_LIBRARY_PATH=./cuda-12.8/:"$LD_LIBRARY_PATH" ./cuda-12.8/llama-server \
    --ctx-size "$CTX_SIZE" \
    --temp 1.0 --top-p 0.95 --min-p 0.0 --top-k 20 --presence-penalty 0.0 --repeat-penalty 1.0 \
    --port 8002 \
    --cache-type-k "$CACHE_TYPE" --cache-type-v "$CACHE_TYPE" --kv-unified \
    --alias "qwen38-27b-uncensored" \
    --flash-attn on \
    --n-gpu-layers "$NGL" \
    --threads 8 \
    --parallel 1 \
    --load-mode none \
    --cache-ram 4096 \
    --reasoning-preserve \
    --cors-origins "*" \
    --tools all \
    -b 2048 -ub 512 \
    -lv 4 \
    --jinja \
    --no-warmup \
    $CHAT_TEMPLATE_ARG \
    $MTP_ARG \
    $VAR_N_CPU_MOE \
    $MMPROJ_ARG \
    --model "$MODEL_DIR/$MODEL" 

