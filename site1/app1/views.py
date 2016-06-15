
import os

from django.views.generic import TemplateView
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse

from . import plots

class IndexView(TemplateView):
    template_name = "index.html"

class Plot1DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot1DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot1d()
        return context

class Plot2DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot2DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot2d()
        return context

class Plot3DView(TemplateView):
    template_name = "plot.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(Plot3DView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot3d()
        return context

class Plot1DMultipleView(TemplateView):
    template_name = "plot_multiple.html"

    def get_context_data(self, **kwargs):
        n = int(kwargs['n'])
        # Call the base implementation first to get a context
        context = super(Plot1DMultipleView, self).get_context_data(**kwargs)
        context['plot'] = plots.plot1d_multiple(n)
        return context

def plot1d_multiple_ajax(request,n):
    """
    Only handles AJAX queries
    """
    print n
    return HttpResponse(plots.plot1d_multiple(int(n)))

class PlotIqView(TemplateView):
    template_name = "plot_fit.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotIqView, self).get_context_data(**kwargs)
        context['filename'] = 'data/{}'.format(self.kwargs['filename'])
        return context

class PlotLiveView(TemplateView):
    template_name = "plot_live.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotLiveView, self).get_context_data(**kwargs)
        context['plot'] = plots.plotLive()
        return context

def  plot_live_update(request):
    '''
    Handle ajax call to update the live plot
    '''
    if request.is_ajax():
        data = plots.live_plot_get_data_serialized()
        # In order to allow non-dict objects to be serialized set the safe parameter to False
        return JsonResponse([data], safe=False)
    else:
        return HttpResponseBadRequest()

class PlotIqSelectFile(TemplateView):
    template_name = "plotIq_select_file.html"

    def get_context_data(self, **kwargs):
        context = super(PlotIqSelectFile, self).get_context_data(**kwargs)
        context["filenames"] = [ "39887_Iq.txt", "HSA_test_Iq.txt", "BAX2_200uL_90p_4m_Iq.txt", "LUV_1u_20p_1o3m_mtcell_Iq.txt", "buffer_0p_1o3m_mtcell_Iq.txt", "39946_Iq.txt", "39948_Iq.txt",
            "67670_frame1_Iq.txt", "67670_frame2_Iq.txt", "67671_frame1_Iq.txt",
            "67671_frame2_Iq.txt", "67672_frame1_Iq.txt", "67672_frame2_Iq.txt",
            "67673_frame1_Iq.txt", "67673_frame2_Iq.txt", "67692_frame1_Iq.txt",
            "67692_frame2_Iq.txt", "67693_frame1_Iq.txt", "67693_frame2_Iq.txt",
            "67694_frame1_Iq.txt", "67694_frame2_Iq.txt", "67695_frame1_Iq.txt",
            "67695_frame2_Iq.txt", "67696_frame1_Iq.txt", "67696_frame2_Iq.txt",
            "67697_frame1_Iq.txt", "67697_frame2_Iq.txt", "67698_frame1_Iq.txt",
            "67698_frame2_Iq.txt", "67699_frame1_Iq.txt", "67699_frame2_Iq.txt",
            "67700_frame1_Iq.txt", "67700_frame2_Iq.txt", "67701_frame1_Iq.txt",
            "67701_frame2_Iq.txt", "67702_frame1_Iq.txt", "67702_frame2_Iq.txt",
            "67703_frame1_Iq.txt", "67703_frame2_Iq.txt", "67704_frame1_Iq.txt",
            "67704_frame2_Iq.txt", "67705_frame1_Iq.txt", "67705_frame2_Iq.txt",
            "67706_frame1_Iq.txt", "67706_frame2_Iq.txt", "67707_frame1_Iq.txt",
            "67707_frame2_Iq.txt", "67708_frame1_Iq.txt", "67708_frame2_Iq.txt",
            "67709_frame1_Iq.txt", "67709_frame2_Iq.txt", "67711_frame1_Iq.txt",
            "67711_frame2_Iq.txt", "67712_frame1_Iq.txt", "67712_frame2_Iq.txt",
            "67713_frame1_Iq.txt", "67713_frame2_Iq.txt", "67714_frame1_Iq.txt",
            "67714_frame2_Iq.txt", "67715_frame1_Iq.txt", "67715_frame2_Iq.txt",
            "67716_frame1_Iq.txt", "67716_frame2_Iq.txt", "67717_frame1_Iq.txt",
            "67717_frame2_Iq.txt", "67718_frame1_Iq.txt", "67718_frame2_Iq.txt",
            "67719_frame1_Iq.txt", "67719_frame2_Iq.txt", "67720_frame1_Iq.txt",
            "67720_frame2_Iq.txt", "67721_frame1_Iq.txt", "67721_frame2_Iq.txt",
            "67722_frame1_Iq.txt", "67722_frame2_Iq.txt", "67723_frame1_Iq.txt",
            "67723_frame2_Iq.txt", "67724_frame1_Iq.txt", "67724_frame2_Iq.txt",
            "67725_frame1_Iq.txt", "67725_frame2_Iq.txt", "67726_frame1_Iq.txt",
            "67726_frame2_Iq.txt", "67727_frame1_Iq.txt", "67727_frame2_Iq.txt",
            "67728_frame1_Iq.txt", "67728_frame2_Iq.txt", "67730_frame1_Iq.txt",
            "67730_frame2_Iq.txt", "67731_frame1_Iq.txt", "67731_frame2_Iq.txt",
            "67732_frame1_Iq.txt", "67732_frame2_Iq.txt", "67733_frame1_Iq.txt",
            "67733_frame2_Iq.txt", "67734_frame1_Iq.txt", "67734_frame2_Iq.txt",
            "67735_frame1_Iq.txt", "67735_frame2_Iq.txt", "67736_frame1_Iq.txt",
            "67736_frame2_Iq.txt", "67737_frame1_Iq.txt", "67737_frame2_Iq.txt",
            "67738_frame1_Iq.txt", "67738_frame2_Iq.txt", "67739_frame1_Iq.txt",
            "67739_frame2_Iq.txt", "67740_frame1_Iq.txt", "67740_frame2_Iq.txt",
            "67741_frame1_Iq.txt", "67741_frame2_Iq.txt", "67742_frame1_Iq.txt",
            "67742_frame2_Iq.txt", "67743_frame1_Iq.txt", "67743_frame2_Iq.txt",
            "67744_frame1_Iq.txt", "67744_frame2_Iq.txt", "67745_frame1_Iq.txt",
            "67745_frame2_Iq.txt", "67746_frame1_Iq.txt", "67746_frame2_Iq.txt",
            "67747_frame1_Iq.txt", "67747_frame2_Iq.txt", "68048_frame1_Iq.txt",
            "68048_frame2_Iq.txt", "68049_frame1_Iq.txt", "68049_frame2_Iq.txt",
            "68050_frame1_Iq.txt", "68050_frame2_Iq.txt", "68051_frame1_Iq.txt",
            "68051_frame2_Iq.txt", "68052_frame1_Iq.txt", "68052_frame2_Iq.txt",
            "68053_frame1_Iq.txt", "68053_frame2_Iq.txt", "68054_frame1_Iq.txt",
            "68054_frame2_Iq.txt", "68055_frame1_Iq.txt", "68055_frame2_Iq.txt",
            "68056_frame1_Iq.txt", "68056_frame2_Iq.txt", "68057_frame1_Iq.txt",
            "68057_frame2_Iq.txt", "68059_frame1_Iq.txt", "68059_frame2_Iq.txt",
            "68060_frame1_Iq.txt", "68060_frame2_Iq.txt", "68061_frame1_Iq.txt",
            "68061_frame2_Iq.txt", "68062_frame1_Iq.txt", "68062_frame2_Iq.txt",
            "68063_frame1_Iq.txt", "68063_frame2_Iq.txt", "68064_frame1_Iq.txt",
            "68064_frame2_Iq.txt", "68065_frame1_Iq.txt", "68065_frame2_Iq.txt",
            "68066_frame1_Iq.txt", "68066_frame2_Iq.txt", "68067_frame1_Iq.txt",
            "68067_frame2_Iq.txt", "68069_frame1_Iq.txt", "68069_frame2_Iq.txt",
            "68070_Iq.txt", "68071_frame1_Iq.txt", "68071_frame2_Iq.txt",
            "68072_frame1_Iq.txt", "68072_frame2_Iq.txt", "68073_frame1_Iq.txt",
            "68073_frame2_Iq.txt", "68074_frame1_Iq.txt", "68074_frame2_Iq.txt",
            "68075_frame1_Iq.txt", "68075_frame2_Iq.txt", "68076_frame1_Iq.txt",
            "68076_frame2_Iq.txt", "68077_frame1_Iq.txt", "68077_frame2_Iq.txt",
            "68079_frame1_Iq.txt", "68079_frame2_Iq.txt", "68080_frame1_Iq.txt",
            "68080_frame2_Iq.txt", "68081_frame1_Iq.txt", "68081_frame2_Iq.txt",
            "68083_frame1_Iq.txt", "68083_frame2_Iq.txt", "68084_frame1_Iq.txt",
            "68084_frame2_Iq.txt", "68085_frame1_Iq.txt", "68085_frame2_Iq.txt",
            "68087_frame1_Iq.txt", "68087_frame2_Iq.txt", "68088_frame1_Iq.txt",
            "68088_frame2_Iq.txt", "68089_frame1_Iq.txt", "68089_frame2_Iq.txt",
            "BAX2_200uL_90p_1o3m_Iq.txt", "BAX2_200uL_90p_1o3m_mtcell_Iq.txt",
            "BAX2_200uL_90p_4m_Iq.txt", "BAX2_200uL_90p_4m_mtcell_Iq.txt",
            "BAX_LUVs_1u_14o6_1o3m_Iq.txt",
            "BAX_LUVs_1u_14o6_1o3m_mtcell_Iq.txt", "BAX_LUVs_1u_14o6_4m_Iq.txt",
            "BAX_LUVs_1u_14o6_4m_mtcell_Iq.txt",
            "BAX_LUVs_50nm_14o6_1o3m_Iq.txt", "BAX_LUVs_50nm_14o6_4m_Iq.txt",
            "BAX_alone_14o6_1o3m_Iq.txt", "BAX_alone_14o6_4m_Iq.txt",
            "HSA_test_Iq.txt", "LUV_1u_0p_1o3m_Iq.txt",
            "LUV_1u_0p_1o3m_mtcell_Iq.txt", "LUV_1u_0p_4m_Iq.txt",
            "LUV_1u_0p_4m_mtcell_Iq.txt", "LUV_1u_10p_1o3m_Iq.txt",
            "LUV_1u_10p_1o3m_mtcell_Iq.txt", "LUV_1u_10p_4m_Iq.txt",
            "LUV_1u_10p_4m_mtcell_Iq.txt", "LUV_1u_14o6p_1o3m_Iq.txt",
            "LUV_1u_14o6p_1o3m_mtcell_Iq.txt", "LUV_1u_14o6p_4m_1o3m_Iq.txt",
            "LUV_1u_14o6p_4m_mtcell_Iq.txt", "LUV_1u_20p_1o3m_Iq.txt",
            "LUV_1u_20p_1o3m_mtcell_Iq.txt", "LUV_1u_20p_4m_Iq.txt",
            "LUV_1u_20p_4m_mtcell_Iq.txt", "LUV_1u_30p_1o3m_Iq.txt",
            "LUV_1u_30p_1o3m_mtcell_Iq.txt", "LUV_1u_30p_4m_Iq.txt",
            "LUV_1u_30p_4m_mtcell_Iq.txt", "LUV_1u_40p_1o3m_Iq.txt",
            "LUV_1u_40p_1o3m_mtcell_Iq.txt", "LUV_1u_40p_4m_Iq.txt",
            "LUV_1u_40p_4m_mtcell_Iq.txt",
            "LUV_50nm_BAX3_224uL_14o6_1o3m_Iq.txt",
            "LUV_50nm_BAX3_224uL_14o6_1o3m_mtcell_Iq.txt",
            "LUV_50nm_BAX3_224uL_14o6_4m_Iq.txt",
            "LUV_50nm_BAX3_224uL_14o6_4m_mtcell_Iq.txt",
            "LUV_50nm_BAX3_224uL_BIM_14o6_1o3m_Iq.txt",
            "LUV_50nm_BAX3_224uL_BIM_14o6_1o3m_mtcell_Iq.txt",
            "LUV_50nm_BAX3_224uL_BIM_14o6_4m_Iq.txt",
            "LUV_50nm_BAX3_224uL_BIM_14o6_4m_mtcell_Iq.txt",
            "LUV_50nm_WTBAX_14o6_1o3m_Iq.txt",
            "LUV_50nm_WTBAX_14o6_1o3m_mtcell_Iq.txt",
            "LUV_50nm_WTBAX_14o6_4m_Iq.txt",
            "LUV_50nm_WTBAX_14o6_4m_mtcell_Iq.txt",
            "buffer_0p_1o3m_mtcell_Iq.txt", "buffer_0p_4m_mtcell_Iq.txt",
            "buffer_10p_1o3m_mtcell_Iq.txt", "buffer_10p_4m_mtcell_Iq.txt",
            "buffer_14o6_1o3m_mtcell_Iq.txt", "buffer_14o6_4m_mtcell_Iq.txt",
            "buffer_14o6p_1o3m_mtcell_Iq.txt", "buffer_14o6p_4m_mtcell_Iq.txt",
            "buffer_1u_14o6_4m_mtcell_Iq.txt", "buffer_20p_1o3m_mtcell_Iq.txt",
            "buffer_20p_4m_mtcell_Iq.txt", "buffer_30p_1o3m_mtcell_Iq.txt",
            "buffer_30p_4m_mtcell_Iq.txt", "buffer_40p_1o3m_mtcell_Iq.txt",
            "buffer_40p_4m_mtcell_Iq.txt", "buffer_90p_1o3m_mtcell_Iq.txt",
            "buffer_90p_4m_mtcell_Iq.txt", "scan1_Iq.txt", "scan2_Iq.txt",
                                 "porsil_2o5m_2o5A_raw.txt", "porsil_3m_10A_raw.txt",
                                 "porsil_4m_10A_raw.txt", "porsil_5m_8A_raw.txt", ]
        return context

class PlotAutoFitSelectFile(TemplateView):
    template_name = "plot_auto_fit_select_file.html"

    def get_context_data(self, **kwargs):
        context = super(PlotAutoFitSelectFile, self).get_context_data(**kwargs)
        context['filenames'] = ['HSA_test.dat', 'scan1_Iq.txt', 'scan2_Iq.txt']
        return context

class PlotAutoFitView(TemplateView):
    template_name = "plot_auto_fit.html"

    def get_context_data(self, **kwargs):
        # Call the base implementation first to get a context
        context = super(PlotAutoFitView, self).get_context_data(**kwargs)
        context['filename'] = 'data/{}'.format(self.kwargs['filename'])
        return context
