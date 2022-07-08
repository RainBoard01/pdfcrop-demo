import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  TextInput,
  Stack,
  Divider,
  Loader,
} from "@mantine/core";
import { Upload, Files, X, Icon as TablerIcon } from "tabler-icons-react";
import { Dropzone, DropzoneStatus, PDF_MIME_TYPE } from "@mantine/dropzone";
import { toPng } from "html-to-image";
import download from "downloadjs";
import { toJSON } from "./pdf/toJSON";
import { extractText } from "./pdf/extractText";
import { useEffect, useState } from "react";
import "./demo.css";

function getIconColor(status: DropzoneStatus, theme: MantineTheme): string {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <Files {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />
    <div>
      <Text size="xl" inline>
        Arrastra documentos PDF aqui o haz click para seleccionarlos
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Agrega cuantos archivos quieras, cada archivo no debe exceder los 5mb
      </Text>
    </div>
  </Group>
);

export function Demo() {
  const [pdfs, setPdfs] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const theme = useMantineTheme();

  useEffect(() => {
    if (pdfs.length > 0) {
      pdfs.map((pdf) =>
        extractText(pdf).then((res) => {
          setData([
            toJSON(
              inputValue,
              [].concat.apply(
                [],
                res.map((page) =>
                  page.items
                    .map((item) => item.str)
                    .filter((item) => item.length > 1)
                )
              )
            ),
          ]);
        })
      );
    }
  }, [pdfs]);

  useEffect(() => {
    if (data.length > 0) {
      console.log(data[0]);
      setLoading(false);
      toPng(document.getElementById("table")).then((url) =>
        download(
          url,
          `vigencia ${data[0]?.target.rpa} ${data[0]?.target.vigencia}.png`
        )
      );
    }
  }, [data]);

  return (
    <Stack>
      <TextInput
        placeholder="123456"
        label="Buscar Nro Registro"
        required
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          width: "200px",
          margin: "auto",
        }}
      />
      <Dropzone
        onDrop={async (files) => {
          setLoading(true);
          files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
              setPdfs((prevState) => [...prevState, reader.result]);
            };
            reader.readAsDataURL(file);
          });
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={5 * 1024 ** 2}
        accept={PDF_MIME_TYPE}
      >
        {(status) => dropzoneChildren(status, theme)}
      </Dropzone>
      {loading ? <Loader /> : ""}
      {data.length > 0 ? (
        <table id="table">
          <tbody>
            <tr>
              <td className="region">{data[0]?.prev.region}</td>
              <td className="nave">{data[0]?.prev.nave}</td>
              <td className="rpa">{data[0]?.prev.rpa}</td>
              <td className="matricula">{data[0]?.prev.matricula}</td>
              <td className="capitania">{data[0]?.prev.capitania}</td>
              <td className="vigencia">{data[0]?.prev.vigencia}</td>
              <td className="armador">{data[0]?.prev.armador}</td>
            </tr>
            <tr>
              <td className="region">{data[0]?.target.region}</td>
              <td className="nave">{data[0]?.target.nave}</td>
              <td className="rpa">{data[0]?.target.rpa}</td>
              <td className="matricula">{data[0]?.target.matricula}</td>
              <td className="capitania">{data[0]?.target.capitania}</td>
              <td className="vigencia">{data[0]?.target.vigencia}</td>
              <td className="armador">{data[0]?.target.armador}</td>
            </tr>
            <tr>
              <td className="region">{data[0]?.next.region}</td>
              <td className="nave">{data[0]?.next.nave}</td>
              <td className="rpa">{data[0]?.next.rpa}</td>
              <td className="matricula">{data[0]?.next.matricula}</td>
              <td className="capitania">{data[0]?.next.capitania}</td>
              <td className="vigencia">{data[0]?.next.vigencia}</td>
              <td className="armador">{data[0]?.next.armador}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        "PDF no cargado"
      )}
    </Stack>
  );
}
