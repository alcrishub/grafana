package supportbundlesimpl

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/grafana/grafana/pkg/api/response"
	"github.com/grafana/grafana/pkg/api/routing"
	"github.com/grafana/grafana/pkg/infra/supportbundles"
	"github.com/grafana/grafana/pkg/middleware"
	"github.com/grafana/grafana/pkg/models"
	"github.com/grafana/grafana/pkg/web"
)

const rootUrl = "/api/support-bundles"

func (s *Service) registerAPIEndpoints(routeRegister routing.RouteRegister) {
	routeRegister.Group(rootUrl, func(subrouter routing.RouteRegister) {
		subrouter.Get("/", middleware.ReqGrafanaAdmin, routing.Wrap(s.handleList))
		subrouter.Post("/", middleware.ReqGrafanaAdmin, routing.Wrap(s.handleCreate))
		subrouter.Get("/:uid", middleware.ReqGrafanaAdmin, s.handleDownload)
		subrouter.Get("/collectors", middleware.ReqGrafanaAdmin, routing.Wrap(s.handleGetCollectors))
	})
}

func (s *Service) handleList(ctx *models.ReqContext) response.Response {
	bundles, err := s.List(ctx.Req.Context())
	if err != nil {
		return response.Error(http.StatusInternalServerError, "failed to list bundles", err)
	}

	data, err := json.Marshal(bundles)
	if err != nil {
		return response.Error(http.StatusInternalServerError, "failed to encode bundle", err)
	}

	return response.JSON(http.StatusOK, data)
}

func (s *Service) handleCreate(ctx *models.ReqContext) response.Response {
	type command struct {
		Collectors []string `json:"collectors"`
	}

	var c command
	if err := web.Bind(ctx.Req, &c); err != nil {
		return response.Error(http.StatusBadRequest, "failed to parse request", err)
	}

	bundle, err := s.Create(context.Background(), c.Collectors, ctx.SignedInUser)
	if err != nil {
		return response.Error(http.StatusInternalServerError, "failed to create support bundle", err)
	}

	data, err := json.Marshal(bundle)
	if err != nil {
		return response.Error(http.StatusInternalServerError, "failed to encode bundle", err)
	}

	return response.JSON(http.StatusCreated, data)
}

func (s *Service) handleDownload(ctx *models.ReqContext) {
	uid := web.Params(ctx.Req)[":uid"]
	bundle, err := s.Get(ctx.Req.Context(), uid)
	if err != nil {
		ctx.Resp.WriteHeader(http.StatusInternalServerError)
		return
	}

	if bundle.State != supportbundles.StateComplete {
		ctx.Resp.WriteHeader(http.StatusLocked)
		return
	}

	ctx.Resp.Header().Set("Content-Type", "application/tar+gzip")
	http.ServeFile(ctx.Resp, ctx.Req, bundle.FilePath)
}

func (s *Service) handleGetCollectors(ctx *models.ReqContext) response.Response {
	collectors := make([]string, 0, len(s.collectors))
	for name := range s.collectors {
		collectors = append(collectors, name)
	}
	return response.JSON(http.StatusOK, collectors)
}
