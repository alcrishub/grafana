package kinds

import (
	"encoding/json"
	"os"
	"reflect"
	"testing"

	"github.com/grafana/grafana-plugin-sdk-go/experimental/schema"
	"github.com/stretchr/testify/require"

	schemaex "github.com/grafana/grafana/pkg/registry/apis/query/schema"
)

func TestQueryTypeDefinitions(t *testing.T) {
	builder, err := schema.NewSchemaBuilder(
		schema.BuilderOptions{
			BasePackage: "github.com/grafana/grafana/pkg/tsdb/prometheus/kinds",
			CodePath:    "./",
			// We need to identify the enum fields explicitly :(
			// *AND* have the +enum common for this to work
			Enums: []reflect.Type{
				reflect.TypeOf(PromQueryFormatTimeSeries), // pick an example value (not the root)
				reflect.TypeOf(QueryEditorModeCode),       // pick an example value (not the root)
			},
		})
	require.NoError(t, err)
	err = builder.AddQueries(
		schema.QueryTypeInfo{
			Name:   "default",
			GoType: reflect.TypeOf(&PrometheusDataQuery{}),
			Examples: []schema.QueryExample{
				{
					Name: "example timeseries",
					QueryPayload: PrometheusDataQuery{
						Format: PromQueryFormatTimeSeries,
						Expr:   "???",
					},
				},
				{
					Name: "example table",
					QueryPayload: PrometheusDataQuery{
						Format: PromQueryFormatTable,
						Expr:   "???",
					},
				},
			},
		},
	)

	require.NoError(t, err)
	builder.UpdateQueryDefinition(t, "dataquery.types.json")

	qt, err := NewQueryHandler()
	require.NoError(t, err)
	s, err := schemaex.GetQuerySchema(qt.QueryTypeDefinitionList())
	require.NoError(t, err)

	out, err := json.MarshalIndent(s, "", "  ")
	require.NoError(t, err)

	err = os.WriteFile("dataquery.schema.json", out, 0644)
	require.NoError(t, err, "error writing file")
}
